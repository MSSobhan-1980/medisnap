
import { Link } from "react-router-dom";

interface FooterProps {
  isLanding?: boolean;
}

export default function Footer({ isLanding = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (isLanding) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <span className="font-bold text-xl text-blue-500">Medi</span>
                <span className="font-bold text-xl text-gray-800">Snap</span>
              </Link>
              <p className="text-sm text-gray-500 mt-1">Medication management made simple</p>
            </div>

            <div className="flex flex-wrap gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-500 text-sm">
                Home
              </Link>
              <Link to="/auth" className="text-gray-600 hover:text-blue-500 text-sm">
                Sign In
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-500 text-sm">
                About Us
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-blue-500 text-sm">
                FAQs
              </Link>
              <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-500 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-use" className="text-gray-600 hover:text-blue-500 text-sm">
                Terms of Use
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} MediSnap. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Flat A-1 & A-2, House No. 4, Road No. 1, Chanduddan Avenue, Mohammadpur, Dhaka - 1207, Bangladesh
            </p>
            <p className="text-gray-500 text-sm mt-1">
              <a href="mailto:info@ailifestyle.tech" className="hover:text-blue-500">info@ailifestyle.tech</a>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-500">MediSnap</h3>
            <p className="text-gray-600 text-sm">
              AI-powered medication organizer that simplifies your healthcare management
              with smart scheduling, reminders, and health reporting.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              <a href="mailto:info@ailifestyle.tech" className="hover:text-blue-500">info@ailifestyle.tech</a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-500 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/scan" className="text-gray-600 hover:text-blue-500 text-sm">
                  Scan Medication
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-500 text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-600 hover:text-blue-500 text-sm">
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-500 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-500 text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-blue-500 text-sm">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-500 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-500 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-gray-600 hover:text-blue-500 text-sm">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-600 hover:text-blue-500 text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/data-privacy" className="text-gray-600 hover:text-blue-500 text-sm">
                  Data Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} MediSnap. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Flat A-1 & A-2, House No. 4, Road No. 1, Chanduddan Avenue, Mohammadpur, Dhaka - 1207, Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
