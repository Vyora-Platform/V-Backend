import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { UploadResult } from "./uploads";

/**
 * S3-Compatible Storage Service for Supabase
 * Uses AWS SDK to interact with Supabase's S3-compatible storage
 */

// S3 Configuration from Supabase
const S3_ENDPOINT = "https://abizuwqnqkbicrhorcig.storage.supabase.co/storage/v1/s3";
const S3_REGION = "ap-south-1";
const S3_ACCESS_KEY = process.env.SUPABASE_S3_ACCESS_KEY || "b22ffe2e5ad5c8f213e2fe9f3db6ca8d";
// For Supabase S3-compatible storage, the secret key is typically the service role key
const S3_SECRET_KEY = process.env.SUPABASE_S3_SECRET_KEY || process.env.NEW_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!S3_SECRET_KEY) {
  throw new Error("SUPABASE_S3_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is required for S3 storage");
}

// Initialize S3 Client
const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: "b22ffe2e5ad5c8f213e2fe9f3db6ca8d",
    secretAccessKey: "756c8229756d59c84ef62843483af064104c2cfda2724115e00e0188c90c23d4",
  },
  forcePathStyle: true, // Required for S3-compatible storage
});

export interface S3UploadOptions {
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
 * Generate a safe file path for S3 Storage
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
 * Upload a file buffer to S3-compatible storage
 */
export async function uploadToS3(
  fileBuffer: Buffer,
  options: S3UploadOptions
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
    // Upload file to S3
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: filePath,
      Body: fileBuffer,
      ContentType: contentType || "application/octet-stream",
      CacheControl: "max-age=3600", // Cache for 1 hour
      // For public buckets, set ACL to public-read
      ...(bucket === "public-assets" && { ACL: "public-read" }),
    });

    await s3Client.send(putCommand);

    // Generate URL based on bucket type
    let url: string;

    if (bucket === "vendor-docs") {
      // For private documents, generate a signed URL (valid for 1 hour)
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: filePath,
      });
      url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
    } else if (bucket === "vendor-media") {
      // For vendor media, generate a signed URL (valid for 1 year)
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: filePath,
      });
      url = await getSignedUrl(s3Client, getCommand, { expiresIn: 31536000 });
    } else {
      // For public files in public-assets bucket, construct public URL
      // Supabase public URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
      const supabaseUrl = "https://abizuwqnqkbicrhorcig.supabase.co";
      url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
    }

    return {
      url,
      path: filePath,
      filename,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to upload file to S3 Storage");
  }
}

/**
 * Delete a file from S3-compatible storage
 */
export async function deleteFromS3(
  filePath: string,
  bucket: string
): Promise<void> {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filePath,
    });

    await s3Client.send(deleteCommand);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete file from S3 Storage");
  }
}

/**
 * Get public URL for a file (for public buckets)
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const supabaseUrl = "https://abizuwqnqkbicrhorcig.supabase.co";
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
}

/**
 * Get signed URL for a file (for private buckets)
 * @param filePath - The file path in the bucket
 * @param bucket - The bucket name
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function getSignedUrlForFile(
  filePath: string,
  bucket: string,
  expiresIn: number = 3600
): Promise<string> {
  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: filePath,
  });
  return await getSignedUrl(s3Client, getCommand, { expiresIn });
}

/**
 * Check if a file exists in S3 Storage
 */
export async function fileExists(
  bucket: string,
  filePath: string
): Promise<boolean> {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: filePath,
    });
    await s3Client.send(getCommand);
    return true;
  } catch (error: any) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

