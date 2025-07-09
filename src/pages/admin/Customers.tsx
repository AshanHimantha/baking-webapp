
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    {
      id: "CUST-001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2023-06-15",
      status: "active",
      kycStatus: "verified",
      balance: 12847.56,
      lastActivity: "2024-01-09"
    },
    {
      id: "CUST-002",
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+1 (555) 234-5678",
      joinDate: "2023-08-22",
      status: "active",
      kycStatus: "verified",
      balance: 5632.10,
      lastActivity: "2024-01-08"
    },
    {
      id: "CUST-003",
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+1 (555) 345-6789",
      joinDate: "2023-11-10",
      status: "pending",
      kycStatus: "pending",
      balance: 0.00,
      lastActivity: "2024-01-07"
    },
    {
      id: "CUST-004",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2023-09-18",
      status: "active",
      kycStatus: "verified",
      balance: 8920.33,
      lastActivity: "2024-01-09"
    },
    {
      id: "CUST-005",
      name: "Alex Chen",
      email: "alex.chen@email.com",
      phone: "+1 (555) 567-8901",
      joinDate: "2023-12-03",
      status: "suspended",
      kycStatus: "rejected",
      balance: 150.75,
      lastActivity: "2024-01-05"
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor and manage customer accounts</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 shadow-banking">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredCustomers.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(customer.status)}`}></div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {customer.id}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getKycStatusIcon(customer.kycStatus)}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            KYC {customer.kycStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden md:block">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${customer.balance.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last active: {customer.lastActivity}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No customers found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
