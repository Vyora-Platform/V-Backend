// Object Storage Service for Replit Object Storage integration
import { Client } from "@replit/object-storage";
import { Response } from "express";
import { randomUUID } from "crypto";

export const objectStorageClient = new Client();

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  async uploadBytes(key: string, data: Buffer, contentType?: string): Promise<void> {
    const result = await objectStorageClient.uploadFromBytes(key, data);
    if (!result.ok) {
      throw new Error(`Upload failed: ${result.error}`);
    }
  }

  async downloadObject(key: string, res: Response, cacheTtlSec: number = 3600): Promise<void> {
    const result = await objectStorageClient.downloadAsBytes(key);
    if (!result.ok) {
      throw new ObjectNotFoundError();
    }

    res.set({
      "Content-Type": "application/octet-stream",
      "Cache-Control": `private, max-age=${cacheTtlSec}`,
    });

    res.send(result.value);
  }

  async getObjectEntityUploadURL(): Promise<string> {
    // Generate a unique upload key
    const objectId = randomUUID();
    const key = `uploads/${objectId}`;
    
    // For Replit object storage, we return a simple identifier that can be used later
    // The actual upload will happen through the backend API
    return key;
  }

  async getObjectEntityFile(objectPath: string): Promise<string> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const key = objectPath.slice(9); // Remove "/objects/" prefix
    const result = await objectStorageClient.downloadAsText(key);
    if (!result.ok) {
      throw new ObjectNotFoundError();
    }

    return key;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    // If it's already a normalized path, return it
    if (rawPath.startsWith("/objects/")) {
      return rawPath;
    }
    
    // Otherwise, convert to normalized path
    return `/objects/${rawPath}`;
  }

  async deleteObject(key: string): Promise<void> {
    const result = await objectStorageClient.delete(key);
    if (!result.ok) {
      throw new Error(`Delete failed: ${result.error}`);
    }
  }

  async listObjects(prefix?: string): Promise<string[]> {
    const result = await objectStorageClient.list(prefix ? { prefix } : undefined);
    if (!result.ok) {
      throw new Error(`List failed: ${result.error}`);
    }
    return result.value.map(obj => obj.key);
  }
}
