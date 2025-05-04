
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-red-500 mb-6">
        <ShieldAlert size={64} />
      </div>
      
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-4">
        Access Denied
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
