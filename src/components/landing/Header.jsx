import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/landingPageData";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img src="/orbinw1.png" alt="Orbin Bank Logo" className="h-11" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-700 hover:text-banking-primary transition-colors">{link.label}</a>
            ))}
            <Link to="/signin" className="text-banking-primary hover:text-banking-primaryDark font-medium transition-colors">Sign In</Link>
            <Link to="/signup">
              <Button className="bg-banking-primary hover:bg-banking-primaryDark text-white">Get Started</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-gray-700 hover:text-banking-primary">{link.label}</a>
            ))}
            <Link to="/signin" className="block text-banking-primary font-medium">Sign In</Link>
            <Link to="/signup" className="block">
              <Button className="w-full bg-banking-primary hover:bg-banking-primaryDark text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;