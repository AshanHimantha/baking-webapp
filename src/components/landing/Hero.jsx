import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp } from "lucide-react";
import { heroStats } from "@/data/landingPageData";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-banking-secondary via-white to-orange-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Banking made <span className="text-banking-primary">simple</span> and <span className="text-banking-primary">secure</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience next-generation digital banking with instant transfers, smart savings, and world-class security. Join millions who trust Orbin Bank.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup"><Button size="lg" className="bg-banking-primary hover:bg-banking-primaryDark text-white px-8 py-4 text-lg">Open Account <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
              <Button size="lg" variant="outline" className="border-banking-primary text-banking-primary hover:bg-banking-primary hover:text-white px-8 py-4 text-lg"><Play className="mr-2 w-5 h-5" /> Watch Demo</Button>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              {heroStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <stat.icon className="w-5 h-5 text-banking-success" />
                  <span className="text-sm text-gray-600">{stat.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-banking-xl p-8 space-y-6">
              <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Account Balance</h3><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></div>
              <div className="space-y-2"><div className="text-3xl font-bold text-gray-900">$24,891.50</div><div className="flex items-center space-x-2"><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-sm text-green-600">+12.5% this month</span></div></div>
              <div className="grid grid-cols-2 gap-4"><div className="bg-banking-secondary rounded-lg p-4"><div className="text-sm text-gray-600">Savings</div><div className="text-lg font-semibold text-gray-900">$18,420.00</div></div><div className="bg-banking-secondary rounded-lg p-4"><div className="text-sm text-gray-600">Checking</div><div className="text-lg font-semibold text-gray-900">$6,471.50</div></div></div>
              <div className="pt-4 border-t border-gray-100"><div className="flex items-center justify-between text-sm"><span className="text-gray-600">Recent transaction</span><span className="text-gray-900 font-medium">-$127.50</span></div><div className="text-xs text-gray-500 mt-1">Coffee Shop • 2 hours ago</div></div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-banking-accent rounded-full animate-float opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-banking-primary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;