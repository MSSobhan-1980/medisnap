
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const MedicationImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('medication_images')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const imageUrls = data.map(file => 
        supabase.storage.from('medication_images').getPublicUrl(file.name).data.publicUrl
      );

      setImages(imageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const fileName = imageUrl.split('/').pop() || '';
      const { error } = await supabase.storage
        .from('medication_images')
        .remove([fileName]);

      if (error) throw error;

      setImages(prevImages => prevImages.filter(url => url !== imageUrl));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (loading) return <div>Loading images...</div>;
  if (images.length === 0) return <div>No images uploaded yet</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img 
            src={imageUrl} 
            alt={`Medication image ${index + 1}`} 
            className="w-full h-48 object-cover rounded-md"
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDeleteImage(imageUrl)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MedicationImageGallery;
