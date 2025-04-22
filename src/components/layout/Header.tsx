import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserRound, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isLanding?: boolean;
}

export default function Header({ isLanding = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`${isLanding ? 'bg-white py-5' : 'bg-white shadow-sm sticky top-0 z-50'}`}>
      <div className="container mx-auto py-2 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-bold text-2xl text-blue-500">Med</span>
          <span className="font-bold text-2xl text-gray-800">Snap</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <NavLinks />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                <Link to="/profile">
                  <Button variant="outline" size="icon">
                    <UserRound className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={async () => { await signOut(); navigate("/auth"); }}>
                  Log Out
                </Button>
              </div>
            </>
          ) : isLanding ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-500 font-medium">
                Home
              </Link>
              <Link to="/features" className="text-gray-700 hover:text-blue-500 font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-500 font-medium">
                Pricing
              </Link>
              <Link to="/sign-in" className="text-gray-700 hover:text-blue-500 font-medium">
                Sign In
              </Link>
              <Link to="/dashboard">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <NavLinks />
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
              </div>
            </>
          )}
        </nav>

        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            {isLanding ? (
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-500 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className="text-gray-700 hover:text-blue-500 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-gray-700 hover:text-blue-500 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  to="/sign-in" 
                  className="text-gray-700 hover:text-blue-500 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/dashboard" 
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <MobileNavLinks closeMenu={() => setMobileMenuOpen(false)} />
                <hr className="my-2" />
                <div className="flex items-center justify-between py-2">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <UserRound className="h-5 w-5" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const NavLinks = () => {
  return (
    <>
      <Link to="/" className="text-gray-700 hover:text-blue-500 font-medium">
        Home
      </Link>
      <Link to="/scan" className="text-gray-700 hover:text-blue-500 font-medium">
        Scan Medication
      </Link>
      <Link to="/dashboard" className="text-gray-700 hover:text-blue-500 font-medium">
        Dashboard
      </Link>
      <Link to="/reports" className="text-gray-700 hover:text-blue-500 font-medium">
        Reports
      </Link>
    </>
  );
};

const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
  return (
    <>
      <Link 
        to="/" 
        className="text-gray-700 hover:text-blue-500 font-medium py-2"
        onClick={closeMenu}
      >
        Home
      </Link>
      <Link 
        to="/scan" 
        className="text-gray-700 hover:text-blue-500 font-medium py-2"
        onClick={closeMenu}
      >
        Scan Medication
      </Link>
      <Link 
        to="/dashboard" 
        className="text-gray-700 hover:text-blue-500 font-medium py-2"
        onClick={closeMenu}
      >
        Dashboard
      </Link>
      <Link 
        to="/reports" 
        className="text-gray-700 hover:text-blue-500 font-medium py-2"
        onClick={closeMenu}
      >
        Reports
      </Link>
    </>
  );
};
