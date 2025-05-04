
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { processImageForUpload } from "@/utils/security/imageProcessing";
import { fileUploadLimiter, withRateLimiting } from "@/utils/security/rateLimiting";

export default function ProfileEditor({ onSave }: { onSave?: () => void }) {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update state when profile data changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Use rate limiting for uploads
      await withRateLimiting(
        fileUploadLimiter,
        async () => {
          // Process image (validate, compress, strip EXIF data)
          const processedFile = await processImageForUpload(file);
          if (!processedFile) {
            setIsUploading(false);
            return; // Validation failed
          }

          // Check if avatars bucket exists
          const { data: bucketList } = await supabase.storage.listBuckets();
          const bucketExists = bucketList?.some(bucket => bucket.name === 'avatars');
          
          // Create bucket if it doesn't exist
          if (!bucketExists) {
            await supabase.storage.createBucket('avatars', {
              public: true,
              fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
            });
            console.log("Created avatars bucket");
          }
          
          const fileExt = processedFile.name.split('.').pop();
          const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

          // Upload file to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, processedFile, { upsert: true });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          setAvatarUrl(publicUrl);
          toast.success("Profile picture uploaded successfully!");
        },
        "Too many upload requests. Please try again in a moment."
      );
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast.error("Error uploading profile picture", { description: error.message });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // Validate inputs
      if (fullName.trim() === "") {
        toast.error("Please enter your name");
        return;
      }

      // Check username format if provided
      if (username && !/^[a-z0-9_\.]+$/.test(username)) {
        toast.error("Username can only contain lowercase letters, numbers, periods and underscores");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          username: username.toLowerCase(),
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
      
      // Refresh profile data
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (onSave) onSave();
    } catch (error: any) {
      toast.error("Error updating profile", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-2xl bg-medsnap-blue text-white">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                onChange={handleAvatarUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                id="avatar-upload"
                ref={fileInputRef}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName"
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Your full name"
              maxLength={50}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Choose a username"
              pattern="^[a-z0-9_\.]+$"
              title="Username can only contain lowercase letters, numbers, periods and underscores"
              maxLength={30}
            />
          </div>
          
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
