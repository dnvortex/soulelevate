import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  url: string;
  publicId: string;
  optimized: string;
  thumbnail: string;
}

const CloudinaryTest = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'inner-appraisal');

      // Upload image
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type here, the browser will set it with the boundary for multipart/form-data
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();

      // Update state with response
      setUploadedImage(data);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cloudinary Image Upload Test</CardTitle>
        <CardDescription>Test uploading images to Cloudinary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image">Select Image</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {uploadedImage && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">Uploaded Image</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Original</p>
                <img 
                  src={uploadedImage.url} 
                  alt="Original" 
                  className="w-full h-auto rounded-md border"
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Thumbnail</p>
                <img 
                  src={uploadedImage.thumbnail} 
                  alt="Thumbnail" 
                  className="w-full h-auto rounded-md border"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CloudinaryTest;