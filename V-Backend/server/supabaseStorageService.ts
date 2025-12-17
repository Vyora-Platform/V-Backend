import { supabaseAdmin } from "./supabase";
import type { UploadResult } from "./uploads";

/**
 * Supabase Storage Service
 * Handles all file uploads, deletions, and URL generation using Supabase Storage
 */

export interface SupabaseUploadOptions {
  vendorId: string;
  category: string;
  isPrivate?: boolean;
  filename?: string;
  contentType?: string;
}

/**
 * Determine which bucket to use based on file type and privacy
 */
function getBucket(category: string, isPrivate: boolean): string {
  // Private documents go to vendor-docs
  if (isPrivate) {
    return "vendor-docs";
  }

  // Public media categories that go to public-assets bucket
  const publicMediaCategories = [
    "logo",
    "hero",
    "banner",
    "gallery",
  ];

  if (publicMediaCategories.includes(category)) {
    return "public-assets";
  }

  // Default to vendor-media for vendor-specific content (products, services, team, testimonial, coupon)
  return "vendor-media";
}

/**
 * Generate a safe file path for Supabase Storage
 * Format: {vendorId}/{category}/{filename}
 */
function generateFilePath(
  vendorId: string,
  category: string,
  filename: string
): string {
  // Sanitize inputs to prevent path traversal
  const safeVendorId = vendorId.replace(/[^a-zA-Z0-9_-]/g, "");
  const safeCategory = category.replace(/[^a-zA-Z0-9_-]/g, "");
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");

  return `${safeVendorId}/${safeCategory}/${safeFilename}`;
}

/**
 * Upload a file buffer to Supabase Storage
 */
export async function uploadToSupabase(
  fileBuffer: Buffer,
  options: SupabaseUploadOptions
): Promise<UploadResult> {
  const { vendorId, category, isPrivate = false, filename, contentType } = options;
    console.log('vendorId##############', vendorId);
    console.log('category##############', category);
    console.log('isPrivate##############', isPrivate);
    console.log('filename##############', filename);
    console.log('contentType##############', contentType);
   

  if (!filename) {
    throw new Error("Filename is required");
  }

  // Determine bucket
  const bucket = getBucket(category, isPrivate);

  // Generate safe file path
  const filePath = generateFilePath(vendorId, category, filename);

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: contentType || "application/octet-stream",
        upsert: false, // Don't overwrite existing files
        cacheControl: "3600", // Cache for 1 hour
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL or signed URL based on bucket type
    let url: string;

    if (bucket === "vendor-docs") {
      // For private documents, generate a signed URL (valid for 1 hour)
      const { data: signedData, error: signedError } =
        await supabaseAdmin.storage.from(bucket).createSignedUrl(filePath, 3600);

      if (signedError) {
        throw new Error(`Failed to generate signed URL: ${signedError.message}`);
      }

      url = signedData.signedUrl;
    } else if (bucket === "vendor-media") {
      // For vendor media (products, services, team photos, etc.), use longer expiration (1 year)
      // These are meant to be displayed but stored in private bucket for vendor isolation
      const { data: signedData, error: signedError } =
        await supabaseAdmin.storage.from(bucket).createSignedUrl(filePath, 31536000);

      if (signedError) {
        throw new Error(`Failed to generate signed URL: ${signedError.message}`);
      }

      url = signedData.signedUrl;
    } else {
      // For public files in public-assets bucket, get public URL
      const { data: publicData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath);

      url = publicData.publicUrl;
    }

    return {
      url,
      path: filePath,
      filename,
    };
  } catch (error) {
    console.error("Error uploading to Supabase:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to upload file to Supabase Storage");
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromSupabase(
  filePath: string,
  bucket: string
): Promise<void> {
  try {
    const { error } = await supabaseAdmin.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting from Supabase:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete file from Supabase Storage");
  }
}

/**
 * Get public URL for a file (for public buckets)
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Get signed URL for a file (for private buckets)
 * @param filePath - The file path in the bucket
 * @param bucket - The bucket name
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function getSignedUrl(
  filePath: string,
  bucket: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Check if a file exists in Supabase Storage
 */
export async function fileExists(
  bucket: string,
  filePath: string
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(filePath.split("/").slice(0, -1).join("/"), {
        limit: 1,
        search: filePath.split("/").pop(),
      });

    if (error) {
      return false;
    }

    return data && data.length > 0;
  } catch {
    return false;
  }
}

