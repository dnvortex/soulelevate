import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: 'dqryxcq0m',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// Log cloud name at startup
console.log(`🖼️ Cloudinary configured with cloud name: ${cloudinary.config().cloud_name}`);

/**
 * Upload an image to Cloudinary
 * @param fileBuffer File buffer to upload
 * @param folderName Folder name to organize uploads
 * @returns Cloudinary upload result
 */
export const uploadImage = async (fileBuffer: Buffer, folderName: string = 'inner-appraisal'): Promise<any> => {
  try {
    // Convert buffer to base64 string
    const base64Data = fileBuffer.toString('base64');
    // Build data URI
    const dataURI = `data:image/jpeg;base64,${base64Data}`;
    
    // Upload to Cloudinary using the upload API
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folderName,
      resource_type: 'image',
      // Add additional options as needed
      // format: 'jpg',
      // transformation: [{ width: 1000, crop: 'limit' }]
    });
    
    console.log(`Image uploaded to Cloudinary: ${result?.public_id}`);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Generate an optimized image URL with responsive sizing
 * @param publicId Public ID of the Cloudinary resource
 * @param width Desired width
 * @param height Desired height
 * @returns Optimized Cloudinary URL
 */
export const getOptimizedImageUrl = (publicId: string, width: number = 800, height?: number): string => {
  const transformations = [
    { width, height, crop: 'limit' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ];
  
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true
  });
};

/**
 * Generate a cropped image URL (useful for thumbnails)
 * @param publicId Public ID of the Cloudinary resource
 * @param width Desired width
 * @param height Desired height
 * @returns Cropped Cloudinary URL
 */
export const getCroppedImageUrl = (publicId: string, width: number = 300, height: number = 300): string => {
  const transformations = [
    { width, height, crop: 'fill', gravity: 'auto' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ];
  
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true
  });
};