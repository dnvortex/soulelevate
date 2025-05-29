import { Express, Request, Response } from "express";
import multer from "multer";
import { uploadImage, getOptimizedImageUrl, getCroppedImageUrl } from "./cloudinary";

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export function registerUploadRoutes(app: Express) {
  // Route for uploading images to Cloudinary
  app.post('/api/upload/image', upload.single('image'), async (req: Request, res: Response) => {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the folder to upload to (default to 'inner-appraisal')
      const folder = req.body.folder || 'inner-appraisal';

      // Upload image to Cloudinary
      const result = await uploadImage(req.file.buffer, folder);

      // Generate optimized URL and thumbnail URL
      const optimizedUrl = getOptimizedImageUrl(result.public_id, 800);
      const thumbnailUrl = getCroppedImageUrl(result.public_id, 300, 300);

      // Return the result
      res.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
        optimized: optimizedUrl,
        thumbnail: thumbnailUrl
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Route for getting an optimized image URL
  app.get('/api/image/optimize', (req: Request, res: Response) => {
    try {
      const { publicId, width, height } = req.query;
      
      if (!publicId || typeof publicId !== 'string') {
        return res.status(400).json({ message: "Missing publicId parameter" });
      }
      
      const widthNum = width ? parseInt(width as string) : 800;
      const heightNum = height ? parseInt(height as string) : undefined;
      
      const url = getOptimizedImageUrl(publicId, widthNum, heightNum);
      res.json({ url });
    } catch (error) {
      console.error("Error generating optimized URL:", error);
      res.status(500).json({ message: "Failed to generate optimized URL" });
    }
  });

  // Route for getting a thumbnail image URL
  app.get('/api/image/thumbnail', (req: Request, res: Response) => {
    try {
      const { publicId, width, height } = req.query;
      
      if (!publicId || typeof publicId !== 'string') {
        return res.status(400).json({ message: "Missing publicId parameter" });
      }
      
      const widthNum = width ? parseInt(width as string) : 300;
      const heightNum = height ? parseInt(height as string) : 300;
      
      const url = getCroppedImageUrl(publicId, widthNum, heightNum);
      res.json({ url });
    } catch (error) {
      console.error("Error generating thumbnail URL:", error);
      res.status(500).json({ message: "Failed to generate thumbnail URL" });
    }
  });
}