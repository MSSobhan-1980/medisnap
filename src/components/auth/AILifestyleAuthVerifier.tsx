
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAILifestyleToken } from "@/utils/security/authVerification";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function AILifestyleAuthVerifier() {
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const { setAILifestyleUserId } = useAuth();
  
  useEffect(() => {
    async function verifyToken() {
      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      
      if (token) {
        try {
          const result = await verifyAILifestyleToken(token);
        
          if (result.valid && result.userId) {
            setAILifestyleUserId(result.userId);
            
            // Remove the token from the URL for security
            window.history.replaceState({}, document.title, window.location.pathname);
            
            toast.success("Successfully authenticated", {
              description: "Welcome to NutriSnap!"
            });
            
            // Redirect to dashboard
            navigate('/dashboard');
          } else {
            console.error('Authentication failed:', result.error);
            toast.error("Authentication failed", {
              description: result.error || "Invalid token"
            });
            navigate('/auth');
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast.error("Authentication error", {
            description: "Could not verify your identity"
          });
          navigate('/auth');
        }
      } else {
        toast.error("Missing authentication token");
        navigate('/auth');
      }
      
      setIsVerifying(false);
    }
    
    verifyToken();
  }, [navigate, setAILifestyleUserId]);
  
  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <h1 className="text-xl font-medium">Verifying your identity...</h1>
        <p className="text-gray-500 mt-2">Please wait while we authenticate you.</p>
      </div>
    );
  }
  
  return null;
}
