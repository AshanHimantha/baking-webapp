import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/landingPageData";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full flex justify-center items-center ">
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 m-0 rounded-none w-full lg:mt-8 mt-5"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 lg:w-7/12 w-11/12 border border-gray-200 bg-white/90  backdrop-blur-sm rounded-full  shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <img src="/orbinw1.png" alt="Orbin Bank Logo" className="h-9" />
            </motion.div>
            <motion.div
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-gray-700 hover:text-banking-primary transition-colors">{link.label}</a>
              ))}
            </motion.div>
            <motion.div
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              {/* <Link to="/signin" className="text-banking-primary font-medium hover:text-banking-primaryDark duration-200">Sign In</Link> */}
              <Link to="/signup">
                <Button className="bg-banking-primary hover:bg-banking-primaryDark text-white rounded-full duration-300">Get Started</Button>
              </Link>
            </motion.div>
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </motion.div>
          </div>
        </motion.div>

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
      </motion.nav>
    </div>
  );
};

export default Header;