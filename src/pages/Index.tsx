
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Shield, TrendingUp, ArrowRight, CheckCircle, Globe, Zap, Star, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-geist">
      {/* Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center shadow-orange-glow">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">BankingPro</h1>
                <p className="text-xs text-orange-600 font-medium">Digital Banking Platform</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">Features</a>
              <a href="#solutions" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">Solutions</a>
              <a href="#about" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">About</a>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="text-gray-600 hover:text-orange-600" asChild>
                <Link to="/customer/dashboard">Sign In</Link>
              </Button>
              <Button className="bg-gradient-orange hover:bg-gradient-orange-dark text-white shadow-orange-glow" asChild>
                <Link to="/admin/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5"></div>
        <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  Trusted by 10,000+ businesses worldwide
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  The Future of
                  <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Digital Banking
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Streamline your financial operations with our comprehensive banking platform. 
                  Powerful tools for businesses and individuals, secured by enterprise-grade technology.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-orange hover:bg-gradient-orange-dark text-white shadow-orange-glow group" asChild>
                  <Link to="/customer/dashboard">
                    Start Banking Today 
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 group" asChild>
                  <Link to="/admin/dashboard">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$2.5B+</div>
                  <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">150+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-banking-xl border border-orange-100 p-8 animate-float">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Account Balance</div>
                        <div className="text-sm text-gray-500">Main Account</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">$124,592.45</div>
                      <div className="text-sm text-green-600 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +12.5%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Income</div>
                      <div className="text-lg font-semibold text-green-600">+$8,450</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Expenses</div>
                      <div className="text-lg font-semibold text-red-600">-$2,340</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-green-600 rotate-180" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Payment Received</div>
                          <div className="text-xs text-gray-500">From: Client ABC</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">+$5,200</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-r from-orange-300/15 to-orange-500/15 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage your finances
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive banking solutions designed for modern businesses and individuals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-2 border-orange-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-orange-glow transition-all">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Customer Management</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Advanced customer relationship tools with personalized banking experiences
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-2 border-orange-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-orange-glow transition-all">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Bank-Grade Security</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Multi-layer security with encryption, fraud detection, and compliance
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-2 border-orange-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-orange-glow transition-all">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Advanced Analytics</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Real-time insights and reporting with predictive financial analytics
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-2 border-orange-100 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-orange-glow transition-all">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Global Reach</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  International banking with multi-currency support and global transfers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Built for modern businesses
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Whether you're a startup or enterprise, our platform scales with your business needs.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Real-time Processing</h4>
                    <p className="text-gray-600">Instant transactions and real-time balance updates across all channels.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">API-First Architecture</h4>
                    <p className="text-gray-600">Seamless integration with existing systems and third-party applications.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Compliance Ready</h4>
                    <p className="text-gray-600">Built-in compliance tools for regulations across multiple jurisdictions.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-orange hover:bg-gradient-orange-dark text-white shadow-orange-glow" asChild>
                  <Link to="/customer/dashboard">Try Customer Portal</Link>
                </Button>
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" asChild>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-banking-xl border border-orange-100 p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Processing Speed", value: "< 100ms", color: "green" },
                    { label: "Success Rate", value: "99.98%", color: "blue" },
                    { label: "Global Coverage", value: "150+", color: "purple" },
                    { label: "Daily Volume", value: "$2.5B+", color: "orange" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className={`text-2xl font-bold ${
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-orange text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to transform your banking experience?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join thousands of businesses and individuals who trust our platform for their financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl" asChild>
                <Link to="/customer/dashboard">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/admin/dashboard">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">BankingPro</h3>
                  <p className="text-sm text-gray-400">Digital Banking Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering businesses and individuals with cutting-edge financial technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Customer Banking</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Admin Dashboard</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Status Page</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BankingPro. All rights reserved. Built with modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
