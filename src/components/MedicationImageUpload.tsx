
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const MedicationImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
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
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-4 file:py-2"
      />
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="flex items-center"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
};

export default MedicationImageUpload;
