
import DataPrivacyCenter from "@/components/privacy/DataPrivacyCenter";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { setupRequiredSqlFunctions } from "@/utils/setupSql";

export default function DataPrivacyPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSetupFunctions = async () => {
    await setupRequiredSqlFunctions();
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Privacy</h1>
        <p className="text-gray-600">
          Manage your personal data and privacy settings
        </p>
        
        {/* Admin-only section to set up required functions */}
        {user && user.email === 'admin@example.com' && (
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md">
            <h3 className="font-medium">Admin Functions</h3>
            <p className="text-sm text-gray-500 mb-2">
              Set up required database functions (one-time operation)
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSetupFunctions}
            >
              Set Up Database Functions
            </Button>
          </div>
        )}
      </div>
      
      <DataPrivacyCenter />
    </div>
  );
}
