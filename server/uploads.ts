import path from "path";
import multer from "multer";
import type { Request } from "express";
import { uploadToS3, deleteFromS3 } from "./s3StorageService";

// ====================
// UPLOAD CONFIGURATION
// ====================

interface UploadConfig {
  maxSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  category: string;
  isPrivate?: boolean;
}

const DEFAULT_IMAGE_CONFIG: Omit<UploadConfig, 'category'> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  isPrivate: false,
};

const DEFAULT_DOCUMENT_CONFIG: Omit<UploadConfig, 'category'> = {
  maxSize: 20 * 1024 * 1024, // 20MB
  allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf"],
  isPrivate: true,
};

// ====================
// MULTER MIDDLEWARE
// ====================

export const createUploadMiddleware = (maxSize: number = 10 * 1024 * 1024) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxSize,
      files: 1,
    },
  }).single("file");
};

// ====================
// UPLOAD HANDLER
// ====================

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
}

export interface UploadOptions {
  vendorId: string;
  category: string;
  isPrivate?: boolean;
  maxSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  filenamePrefix?: string;
}

export async function handleFileUpload(
  file: Express.Multer.File,
  options: UploadOptions
): Promise<UploadResult> {
  const {
    vendorId,
    category,
    isPrivate = false,
    maxSize = 10 * 1024 * 1024,
    allowedMimeTypes = DEFAULT_IMAGE_CONFIG.allowedMimeTypes,
    allowedExtensions = DEFAULT_IMAGE_CONFIG.allowedExtensions,
    filenamePrefix = category,
  } = options;

  // Validate file type
  if (!file.mimetype || !allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`);
  }

  // Validate file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    throw new Error(`File too large. Maximum size is ${sizeMB}MB`);
  }

  // Sanitize filename and create unique name
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(file.originalname).toLowerCase();
  const safeExt = allowedExtensions.includes(ext) ? ext : allowedExtensions[0];
  const filename = `${filenamePrefix}-${timestamp}-${randomSuffix}${safeExt}`;

  // Upload to S3-compatible storage (Supabase)
  const result = await uploadToS3(file.buffer, {
    vendorId,
    category,
    isPrivate,
    filename,
    contentType: file.mimetype,
  });

  return result;
}

// ====================
// PRESET CONFIGURATIONS
// ====================

export const UploadPresets = {
  // Logo uploads (public, images only)
  logo: {
    category: "logo",
    isPrivate: false,
    ...DEFAULT_IMAGE_CONFIG,
  },

  // Banner uploads (public, images only)
  banner: {
    category: "banner",
    isPrivate: false,
    ...DEFAULT_IMAGE_CONFIG,
  },

  // Product images (public, images only)
  productImage: {
    category: "products",
    isPrivate: false,
    ...DEFAULT_IMAGE_CONFIG,
  },

  // Service images (public, images only)
  serviceImage: {
    category: "services",
    isPrivate: false,
    ...DEFAULT_IMAGE_CONFIG,
  },

  // Team member photos (public, images only)
  teamPhoto: {
    category: "team",
    isPrivate: false,
    ...DEFAULT_IMAGE_CONFIG,
  },

  // Gallery images (public, images only)
  galleryImage: {
    category: "gallery",
    isPrivate: false,
    ...DEFAULT_IMAGE_CONFIG,
  },

  // Ledger attachments (private, images + PDFs)
  ledgerAttachment: {
    category: "ledger-attachments",
    isPrivate: true,
    ...DEFAULT_DOCUMENT_CONFIG,
  },

  // Invoice documents (private, images + PDFs)
  invoiceDocument: {
    category: "invoices",
    isPrivate: true,
    ...DEFAULT_DOCUMENT_CONFIG,
  },

  // License documents (private, images + PDFs)
  licenseDocument: {
    category: "licenses",
    isPrivate: true,
    ...DEFAULT_DOCUMENT_CONFIG,
  },
};

// ====================
// EXPRESS ROUTE HELPER
// ====================

export function createUploadRoute(preset: keyof typeof UploadPresets) {
  const config = UploadPresets[preset];
  
  return async (req: Request & { file?: Express.Multer.File }, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const vendorId = req.params.vendorId || req.body.vendorId;
      if (!vendorId) {
        return res.status(400).json({ error: "Vendor ID is required" });
      }

      const result = await handleFileUpload(req.file, {
        vendorId,
        ...config,
      });

      res.json(result);
    } catch (error) {
      console.error(`Upload error [${preset}]:`, error);
      const message = error instanceof Error ? error.message : "Failed to upload file";
      res.status(400).json({ error: message });
    }
  };
}

// ====================
// GENERIC UPLOAD ROUTE
// ====================

export const genericUploadHandler = async (
  req: Request & { file?: Express.Multer.File },
  res: any
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { vendorId, category } = req.params;
    if (!vendorId || !category) {
      return res.status(400).json({ error: "Vendor ID and category are required" });
    }

    // Determine if this should be private based on category
    const privateCategories = ["ledger-attachments", "invoices", "licenses", "documents"];
    const isPrivate = privateCategories.includes(category);

    const result = await handleFileUpload(req.file, {
      vendorId,
      category,
      isPrivate,
    });

    res.json(result);
  } catch (error) {
    console.error("Generic upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload file";
    res.status(400).json({ error: message });
  }
};

/**
 * Delete a file from Supabase Storage
 * @param filePath - The file path in Supabase Storage (format: vendorId/category/filename)
 * @param isPrivate - Whether the file is private (determines bucket)
 */
export async function deleteFile(
  filePath: string,
  category: string,
  isPrivate: boolean = false
): Promise<void> {
  // Determine bucket based on category and privacy
  const privateCategories = ["ledger-attachments", "invoices", "licenses", "documents"];
  const bucket = isPrivate || privateCategories.includes(category)
    ? "vendor-docs"
    : category === "logo" || category === "hero" || category === "banner" || category === "gallery"
    ? "public-assets"
    : "vendor-media";

  await deleteFromS3(filePath, bucket);
}

