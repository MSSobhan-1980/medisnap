
import { supabase } from "@/integrations/supabase/client";
import { processImageForUpload } from "@/utils/security/imageProcessing";
import { fileUploadLimiter, withRateLimiting } from "@/utils/security/rateLimiting";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface UploadOptions {
  bucket: string;
  folder?: string;
  isPublic?: boolean;
  contentType?: string;
  maxSizeBytes?: number;
}

/**
 * Upload a file to Supabase storage securely
 */
export const uploadFile = async (file: File, options: UploadOptions): Promise<string | null> => {
  try {
    // Apply rate limiting
    return await withRateLimiting(
      fileUploadLimiter,
      async () => {
        // Default options
        const {
          bucket,
          folder = "",
          isPublic = false,
          maxSizeBytes = 5 * 1024 * 1024, // 5MB default
        } = options;
        
        // Validate file size
        if (file.size > maxSizeBytes) {
          const maxSizeMB = maxSizeBytes / (1024 * 1024);
          toast.error(`File too large (max ${maxSizeMB}MB)`);
          return null;
        }

        // Generate a unique filename to prevent overwriting
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;
        
        // Upload file
        const { data, error } = await supabase
          .storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            contentType: options.contentType || file.type,
            upsert: false
          });
          
        if (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload file", {
            description: error.message
          });
          return null;
        }
        
        // Get URL
        if (isPublic) {
          const { data: publicUrlData } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(filePath);
            
          return publicUrlData?.publicUrl || null;
        } else {
          // Get signed URL with expiration for private files
          const { data: signedData } = await supabase
            .storage
            .from(bucket)
            .createSignedUrl(filePath, 3600); // 1 hour expiry
            
          return signedData?.signedUrl || null;
        }
      },
      "Too many file uploads. Please try again later."
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    toast.error("Upload failed", { 
      description: error.message || "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Upload an image with security processing (compression, EXIF stripping)
 */
export const uploadImage = async (
  file: File, 
  options: UploadOptions
): Promise<string | null> => {
  try {
    // Process image for security
    const processedFile = await processImageForUpload(file);
    if (!processedFile) return null;
    
    // Upload processed file
    return await uploadFile(processedFile, options);
  } catch (error: any) {
    console.error("Image upload error:", error);
    toast.error("Image upload failed", { 
      description: error.message || "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Delete a file from storage
 */
export const deleteFile = async (
  bucket: string,
  filePath: string
): Promise<boolean> => {
  try {
    // Extract file path from URL if a full URL was provided
    let path = filePath;
    if (filePath.includes('storage/v1/object/public/')) {
      path = filePath.split('storage/v1/object/public/')[1];
      // Remove bucket name from path
      path = path.substring(path.indexOf('/') + 1);
    }
    
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("File deletion error:", error);
    return false;
  }
};
