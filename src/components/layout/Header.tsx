
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserRound, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-medsnap-blue text-white rounded-md p-1">
            <span className="font-bold text-xl">Med</span>
            <span className="font-medium text-xl">Snap</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
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
          </div>
        </div>
      )}
    </header>
  );
}

// Desktop Navigation Links
const NavLinks = () => {
  return (
    <>
      <Link to="/" className="text-gray-700 hover:text-medsnap-blue font-medium">
        Home
      </Link>
      <Link to="/scan" className="text-gray-700 hover:text-medsnap-blue font-medium">
        Scan Medication
      </Link>
      <Link to="/dashboard" className="text-gray-700 hover:text-medsnap-blue font-medium">
        Dashboard
      </Link>
      <Link to="/reports" className="text-gray-700 hover:text-medsnap-blue font-medium">
        Reports
      </Link>
    </>
  );
};

// Mobile Navigation Links
const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
  return (
    <>
      <Link 
        to="/" 
        className="text-gray-700 hover:text-medsnap-blue font-medium py-2"
        onClick={closeMenu}
      >
        Home
      </Link>
      <Link 
        to="/scan" 
        className="text-gray-700 hover:text-medsnap-blue font-medium py-2"
        onClick={closeMenu}
      >
        Scan Medication
      </Link>
      <Link 
        to="/dashboard" 
        className="text-gray-700 hover:text-medsnap-blue font-medium py-2"
        onClick={closeMenu}
      >
        Dashboard
      </Link>
      <Link 
        to="/reports" 
        className="text-gray-700 hover:text-medsnap-blue font-medium py-2"
        onClick={closeMenu}
      >
        Reports
      </Link>
    </>
  );
};
