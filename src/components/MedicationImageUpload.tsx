
import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Camera } from 'lucide-react';

const MedicationImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleCameraClick = () => {
    // Activate camera input for capturing photo
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from('medication_images')
        .upload(filePath, file);

      if (error) throw error;

      toast.success('Image uploaded successfully');
      setFile(null);
      
      // Reset the file input fields
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-4 file:py-2"
      />
      
      {/* Hidden camera input that activates device camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={handleCameraClick}
          className="flex items-center"
        >
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
      
      {file && (
        <div className="mt-2 w-full">
          <p className="text-sm text-gray-600">
            Selected file: {file.name}
          </p>
          {file.type.startsWith('image/') && (
            <div className="mt-2 max-w-xs">
              <img
                src={URL.createObjectURL(file)}
                alt="Selected"
                className="h-auto w-full rounded border border-gray-200"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationImageUpload;
