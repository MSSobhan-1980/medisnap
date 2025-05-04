
import DataPrivacyCenter from "@/components/privacy/DataPrivacyCenter";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function DataPrivacyPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Privacy</h1>
        <p className="text-gray-600">
          Manage your personal data and privacy settings
        </p>
      </div>
      
      <DataPrivacyCenter />
    </div>
  );
}
