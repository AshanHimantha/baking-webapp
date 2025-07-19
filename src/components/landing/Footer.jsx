const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2"><img src="/orbinw1.png" alt="Orbin Bank Logo" className="h-10 bg-white px-4 rounded-sm" /></div>
            <p className="text-gray-400">Next-generation digital banking designed for the modern world.</p>
            <div className="flex space-x-4"><div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-banking-primary transition-colors cursor-pointer"><span className="text-sm font-bold">f</span></div><div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-banking-primary transition-colors cursor-pointer"><span className="text-sm font-bold">t</span></div><div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-banking-primary transition-colors cursor-pointer"><span className="text-sm font-bold">in</span></div></div>
          </div>
          <div><h3 className="font-semibold mb-4">Products</h3><div className="space-y-2 text-gray-400"><div className="hover:text-white cursor-pointer">Checking Account</div><div className="hover:text-white cursor-pointer">Savings Account</div><div className="hover:text-white cursor-pointer">Credit Cards</div><div className="hover:text-white cursor-pointer">Loans</div><div className="hover:text-white cursor-pointer">Investments</div></div></div>
          <div><h3 className="font-semibold mb-4">Support</h3><div className="space-y-2 text-gray-400"><div className="hover:text-white cursor-pointer">Help Center</div><div className="hover:text-white cursor-pointer">Contact Us</div><div className="hover:text-white cursor-pointer">Security Center</div><div className="hover:text-white cursor-pointer">Report Fraud</div><div className="hover:text-white cursor-pointer">System Status</div></div></div>
          <div><h3 className="font-semibold mb-4">Company</h3><div className="space-y-2 text-gray-400"><div className="hover:text-white cursor-pointer">About Us</div><div className="hover:text-white cursor-pointer">Careers</div><div className="hover:text-white cursor-pointer">Press</div><div className="hover:text-white cursor-pointer">Legal</div><div className="hover:text-white cursor-pointer">Privacy</div></div></div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">© 2025 Orbin Bank. All rights reserved. <span className="mx-2">|</span> Developed by <a href="https://ashanhimantha.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Ashan Himantha</a></div>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0"><div className="hover:text-white cursor-pointer">Terms of Service</div><div className="hover:text-white cursor-pointer">Privacy Policy</div><div className="hover:text-white cursor-pointer">Cookie Policy</div></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;