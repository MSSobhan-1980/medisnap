
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileSetupPage() {
  const { user, profile, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
    // If the profile exists, skip setup
    if (profile && profile.full_name) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (!fullName.trim() || !username.trim()) {
      toast.error("Both fields are required.");
      setSubmitting(false);
      return;
    }

    // Upsert profile info
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, username })
      .eq("id", user.id);

    if (error) {
      toast.error("Error saving profile", { description: error.message });
      setSubmitting(false);
      return;
    }

    toast.success("Profile created!");
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-center mb-2">Set Up Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
