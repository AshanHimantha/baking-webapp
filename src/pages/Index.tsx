
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BankingUI</h1>
          </div>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link to="/customer/dashboard">Customer Login</Link>
            </Button>
            <Button asChild>
              <Link to="/admin/dashboard">Admin Portal</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Modern Digital Banking
            <span className="text-blue-600 block">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Experience the future of banking with our comprehensive digital platform. 
            Elegant design meets powerful functionality for both customers and administrators.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/customer/dashboard">Try Customer App</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/admin/dashboard">Admin Demo</Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6 shadow-banking hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Customer Experience</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Intuitive interface for seamless banking operations
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 shadow-banking hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Safe</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Bank-grade security with modern authentication
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 shadow-banking hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Comprehensive reporting and insights dashboard
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 shadow-banking hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <Building2 className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Admin Control</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Complete administrative oversight and management
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Preview */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              Two Powerful Interfaces
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Customer Banking App</h4>
                  <p className="text-gray-600 dark:text-gray-300">Complete personal banking with transfers, transactions, and card management</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Admin Dashboard</h4>
                  <p className="text-gray-600 dark:text-gray-300">Professional administration with customer management and analytics</p>
                </div>
              </div>
            </div>
            <div className="space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/customer/dashboard">Explore Customer App</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/dashboard">View Admin Panel</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-8 shadow-banking-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <div className="w-full h-3 bg-blue-200 rounded mb-2"></div>
                  <div className="w-3/4 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <div className="w-full h-3 bg-green-200 rounded mb-2"></div>
                  <div className="w-2/3 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md col-span-2">
                  <div className="w-full h-3 bg-purple-200 rounded mb-2"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 BankingUI. A comprehensive digital banking interface showcase.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
