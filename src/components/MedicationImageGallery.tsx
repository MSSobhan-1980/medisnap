
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw, ImageIcon } from 'lucide-react';

const MedicationImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
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
      setRefreshing(false);
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
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserImages();
  };

  if (loading && images.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center mb-4">
          <ImageIcon className="h-12 w-12 text-gray-300" />
        </div>
        <div>Loading images...</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">Your medication images</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {images.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex justify-center mb-2">
            <ImageIcon className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
      )}
    </div>
  );
};

export default MedicationImageGallery;
