import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/landingPageData";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full flex justify-center items-center ">
    <nav className=" fixed top-0 left-0 right-0 z-50 m-0 rounded-none w-full mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 lg:w-7/12 w-11/12 border border-gray-200 bg-white/90  backdrop-blur-sm rounded-full  shadow-sm">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-2">
            <img src="/orbinw1.png" alt="Orbin Bank Logo" className="h-9" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-700 hover:text-banking-primary transition-colors">{link.label}</a>
            ))}
           
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* <Link to="/signin" className="text-banking-primary font-medium hover:text-banking-primaryDark duration-200">Sign In</Link> */}
            <Link to="/signup">
              <Button className="bg-banking-primary hover:bg-banking-primaryDark text-white rounded-full duration-300">Get Started</Button>
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
        <div className="md:hidden absolute left-0 right-0 top-16 bg-white border-t border-gray-200 shadow-lg z-50">
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
    </div>
  );
};

export default Header;