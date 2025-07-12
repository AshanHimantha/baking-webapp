
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Play, CheckCircle, Shield, Clock, Zap, PiggyBank, Smartphone, CreditCard, BarChart3, Eye, Lock, Users, Menu, X, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-geist">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-banking-primary" />
              <span className="text-xl font-bold text-gray-900">MyBank</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-banking-primary transition-colors">Features</a>
              <a href="#security" className="text-gray-700 hover:text-banking-primary transition-colors">Security</a>
              <a href="#about" className="text-gray-700 hover:text-banking-primary transition-colors">About</a>
              <Link to="/signin" className="text-banking-primary hover:text-banking-primaryDark font-medium transition-colors">Sign In</Link>
              <Link to="/signup">
                <Button className="bg-banking-primary hover:bg-banking-primaryDark text-white">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-banking-primary">Features</a>
              <a href="#security" className="block text-gray-700 hover:text-banking-primary">Security</a>
              <a href="#about" className="block text-gray-700 hover:text-banking-primary">About</a>
              <Link to="/signin" className="block text-banking-primary font-medium">Sign In</Link>
              <Link to="/signup" className="block">
                <Button className="w-full bg-banking-primary hover:bg-banking-primaryDark text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-banking-secondary via-white to-orange-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Banking made 
                  <span className="text-banking-primary"> simple</span> and 
                  <span className="text-banking-primary"> secure</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience next-generation digital banking with instant transfers, smart savings, and world-class security. Join millions who trust MyBank.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-banking-primary hover:bg-banking-primaryDark text-white px-8 py-4 text-lg">
                    Open Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <Button size="lg" variant="outline" className="border-banking-primary text-banking-primary hover:bg-banking-primary hover:text-white px-8 py-4 text-lg">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-banking-success" />
                  <span className="text-sm text-gray-600">FDIC Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-banking-success" />
                  <span className="text-sm text-gray-600">Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-banking-success" />
                  <span className="text-sm text-gray-600">24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-banking-xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Account Balance</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">$24,891.50</div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">+12.5% this month</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-banking-secondary rounded-lg p-4">
                    <div className="text-sm text-gray-600">Savings</div>
                    <div className="text-lg font-semibold text-gray-900">$18,420.00</div>
                  </div>
                  <div className="bg-banking-secondary rounded-lg p-4">
                    <div className="text-sm text-gray-600">Checking</div>
                    <div className="text-lg font-semibold text-gray-900">$6,471.50</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Recent transaction</span>
                    <span className="text-gray-900 font-medium">-$127.50</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Coffee Shop • 2 hours ago</div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-banking-accent rounded-full animate-float opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-banking-primary rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Everything you need in one place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From instant transfers to intelligent budgeting, discover features designed for modern banking.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Transfers",
                description: "Send money instantly to anyone, anywhere. No delays, no hassles.",
                color: "text-banking-primary"
              },
              {
                icon: PiggyBank,
                title: "Smart Savings",
                description: "Automated savings that work in the background to grow your wealth.",
                color: "text-banking-accent"
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your money is protected with military-grade encryption and fraud monitoring.",
                color: "text-banking-success"
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                description: "Full banking functionality in your pocket. Manage everything on the go.",
                color: "text-banking-primary"
              },
              {
                icon: CreditCard,
                title: "Smart Cards",
                description: "Virtual and physical cards with real-time spending controls and rewards.",
                color: "text-banking-accent"
              },
              {
                icon: BarChart3,
                title: "Spending Insights",
                description: "Understand your spending patterns with intelligent categorization and analytics.",
                color: "text-banking-success"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-banking-lg transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-gradient-to-br from-gray-50 to-banking-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Your security is our 
                  <span className="text-banking-primary"> top priority</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We use cutting-edge technology and industry best practices to keep your money and data safe.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "256-bit SSL Encryption",
                    description: "All data is encrypted using bank-grade SSL technology"
                  },
                  {
                    icon: Eye,
                    title: "24/7 Fraud Monitoring",
                    description: "AI-powered systems monitor every transaction for suspicious activity"
                  },
                  {
                    icon: Lock,
                    title: "Biometric Authentication",
                    description: "Secure access using fingerprint and face recognition"
                  },
                  {
                    icon: Users,
                    title: "FDIC Insured",
                    description: "Your deposits are protected up to $250,000 by FDIC insurance"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-banking-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-banking-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Security Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">All systems secure</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-900">Account Verification</span>
                      </div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-900">Two-Factor Authentication</span>
                      </div>
                      <span className="text-xs text-green-600">Enabled</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-900">Device Recognition</span>
                      </div>
                      <span className="text-xs text-green-600">Protected</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">Last security scan</div>
                      <div className="text-sm font-medium text-gray-900">2 minutes ago</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Trusted by millions worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the community of users who have chosen <span className="text-orange-500">Orbin</span> for their financial journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-banking-primary">2M+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-banking-primary">$50B+</div>
              <div className="text-gray-600">Transactions Processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-banking-primary">99.9%</div>
              <div className="text-gray-600">Uptime Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-orange">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to transform your banking experience?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join millions of users who have already made the switch to smarter, faster, and more secure banking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-banking-primary hover:bg-gray-100 px-8 py-4 text-lg">
                  Open Your Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-banking-primary px-8 py-4 text-lg">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-banking-primary" />
                <span className="text-xl font-bold">MyBank</span>
              </div>
              <p className="text-gray-400">
                Next-generation digital banking designed for the modern world.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-banking-primary transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-banking-primary transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-banking-primary transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">Checking Account</div>
                <div className="hover:text-white cursor-pointer">Savings Account</div>
                <div className="hover:text-white cursor-pointer">Credit Cards</div>
                <div className="hover:text-white cursor-pointer">Loans</div>
                <div className="hover:text-white cursor-pointer">Investments</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">Help Center</div>
                <div className="hover:text-white cursor-pointer">Contact Us</div>
                <div className="hover:text-white cursor-pointer">Security Center</div>
                <div className="hover:text-white cursor-pointer">Report Fraud</div>
                <div className="hover:text-white cursor-pointer">System Status</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Careers</div>
                <div className="hover:text-white cursor-pointer">Press</div>
                <div className="hover:text-white cursor-pointer">Legal</div>
                <div className="hover:text-white cursor-pointer">Privacy</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 MyBank. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <div className="hover:text-white cursor-pointer">Terms of Service</div>
              <div className="hover:text-white cursor-pointer">Privacy Policy</div>
              <div className="hover:text-white cursor-pointer">Cookie Policy</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
