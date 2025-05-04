
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "@/pages/ProfileSetupPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import AuthPage from "@/pages/AuthPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import DataPrivacyPage from "@/pages/DataPrivacyPage";
import CookieConsent from "@/components/privacy/CookieConsent";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/legal/TermsOfServicePage";
import CookiePolicyPage from "@/pages/legal/CookiePolicyPage";
import ContactPage from "@/pages/ContactPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AILifestyleAuthVerifier } from "@/components/auth/AILifestyleAuthVerifier";

// Import LogRocket conditionally
let LogRocket: any;

// Initialize LogRocket only in production and if available
if (import.meta.env.PROD) {
  try {
    // Dynamic import for LogRocket
    import('logrocket').then((module) => {
      LogRocket = module.default;
      LogRocket.init("nutrisnap/app");
    }).catch((err) => {
      console.error("LogRocket failed to load:", err);
    });
  } catch (error) {
    console.error("Error importing LogRocket:", error);
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Define the app routes component
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout isLanding={true}><LandingPage /></Layout>} />
    <Route path="/auth" element={<Layout isLanding={true}><AuthPage /></Layout>} />
    <Route path="/profile-setup" element={
      <ProtectedRoute>
        <Layout><ProfileSetupPage /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/home" element={
      <ProtectedRoute>
        <Layout><HomePage /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/scan" element={
      <ProtectedRoute>
        <Layout><ScanPage /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Layout><DashboardPage /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/reports" element={
      <ProtectedRoute>
        <Layout><ReportsPage /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <Layout><ProfilePage /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/data-privacy" element={
      <ProtectedRoute>
        <Layout><DataPrivacyPage /></Layout>
      </ProtectedRoute>
    } />
    
    {/* Legal pages - public */}
    <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
    <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
    <Route path="/cookie-policy" element={<Layout><CookiePolicyPage /></Layout>} />
    <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
    
    {/* Special routes */}
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="/verify" element={<AILifestyleAuthVerifier />} />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  // Set security headers via meta tags
  useEffect(() => {
    // Add Content Security Policy meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.logrocket.io; connect-src 'self' https://*.supabase.co https://cdn.logrocket.io https://r.lr-ingest.io; img-src 'self' data: https://*.supabase.co https://cdn.logrocket.io; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(cspMeta);
    
    // Add X-Frame-Options meta tag
    const xfoMeta = document.createElement('meta');
    xfoMeta.httpEquiv = 'X-Frame-Options';
    xfoMeta.content = 'SAMEORIGIN';
    document.head.appendChild(xfoMeta);
    
    return () => {
      document.head.removeChild(cspMeta);
      document.head.removeChild(xfoMeta);
    };
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
