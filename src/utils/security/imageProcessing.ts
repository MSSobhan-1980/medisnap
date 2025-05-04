
/**
 * Utilities for secure image processing
 */

import { toast } from "sonner";

/**
 * Maximum file size for images in bytes
 * Default: 5MB
 */
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

/**
 * Validate image file type and size
 * @param file File to validate
 * @returns True if valid, false otherwise
 */
export function validateImageFile(file: File): boolean {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    toast.error(`Invalid file type. Allowed types: JPEG, PNG, WebP`, {
      description: "Please select a supported image format"
    });
    return false;
  }
  
  // Check file size
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    const maxSizeMB = MAX_IMAGE_FILE_SIZE / (1024 * 1024);
    toast.error(`File too large (max ${maxSizeMB}MB)`, {
      description: "Please select a smaller image"
    });
    return false;
  }
  
  return true;
}

/**
 * Compress an image file to reduce size
 * @param file Image file to compress
 * @param maxWidthHeight Maximum width/height in pixels
 * @param quality JPEG quality (0-1)
 * @returns Promise resolving to compressed file or original if compression fails
 */
export async function compressImage(
  file: File,
  maxWidthHeight: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    try {
      // Create image object
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = function(e) {
        img.onload = function() {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidthHeight || height > maxWidthHeight) {
            if (width > height) {
              height = Math.round((height * maxWidthHeight) / width);
              width = maxWidthHeight;
            } else {
              width = Math.round((width * maxWidthHeight) / height);
              height = maxWidthHeight;
            }
          }
          
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file); // Fall back to original if canvas not supported
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // Fall back to original if blob conversion fails
                return;
              }
              
              // Create new file
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              // Check if compression actually reduced size
              if (newFile.size < file.size) {
                resolve(newFile);
              } else {
                resolve(file); // Use original if compression didn't help
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        } else {
          resolve(file); // Fall back to original
        }
      };
      
      reader.onerror = function() {
        resolve(file); // Fall back to original
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image compression error:', error);
      resolve(file); // Fall back to original
    }
  });
}

/**
 * Strip EXIF data from an image for privacy
 * @param file Image file to process
 * @returns Promise resolving to processed file
 */
export async function stripExifData(file: File): Promise<File> {
  return new Promise((resolve) => {
    try {
      // Create image object
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = function(e) {
        img.onload = function() {
          // Create canvas with original dimensions
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image on canvas (this strips EXIF data)
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file); // Fall back to original if canvas not supported
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // Fall back to original if blob conversion fails
                return;
              }
              
              // Create new file with same MIME type as original
              const newFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              resolve(newFile);
            },
            file.type
          );
        };
        
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        } else {
          resolve(file); // Fall back to original
        }
      };
      
      reader.onerror = function() {
        resolve(file); // Fall back to original
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('EXIF stripping error:', error);
      resolve(file); // Fall back to original
    }
  });
}

/**
 * Process an image for secure upload (validation, compression, EXIF stripping)
 * @param file Image file to process
 * @returns Promise resolving to processed file or null if validation fails
 */
export async function processImageForUpload(file: File): Promise<File | null> {
  // Validate file
  if (!validateImageFile(file)) {
    return null;
  }
  
  try {
    // Strip EXIF data first
    const exifStrippedFile = await stripExifData(file);
    
    // Then compress
    const compressedFile = await compressImage(exifStrippedFile);
    
    return compressedFile;
  } catch (error) {
    console.error('Image processing error:', error);
    return file; // Fall back to original file
  }
}
