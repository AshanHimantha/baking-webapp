
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Calendar,
  FileText,
  Filter
} from "lucide-react";

const AdminReports = () => {
  const reports = [
    {
      id: "RPT-001",
      name: "Monthly Transaction Report",
      type: "Transactions",
      period: "January 2024",
      generated: "2024-01-09",
      status: "ready",
      size: "2.4 MB"
    },
    {
      id: "RPT-002",
      name: "Customer Growth Analysis",
      type: "Analytics",
      period: "Q4 2023",
      generated: "2024-01-08",
      status: "ready",
      size: "1.8 MB"
    },
    {
      id: "RPT-003",
      name: "Risk Assessment Report",
      type: "Compliance",
      period: "December 2023",
      generated: "2024-01-07",
      status: "processing",
      size: "—"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate and download comprehensive reports</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Custom Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$2.4M</p>
                  <p className="text-xs text-green-600">+15.3% vs last month</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction Volume</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45,789</p>
                  <p className="text-xs text-blue-600">+8.2% vs last month</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">94.5%</p>
                  <p className="text-xs text-green-600">+2.1% vs last month</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Templates */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Quick Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Transaction Summary", icon: BarChart3, color: "bg-blue-500" },
                { name: "Customer Analytics", icon: PieChart, color: "bg-green-500" },
                { name: "Revenue Report", icon: TrendingUp, color: "bg-purple-500" },
                { name: "Compliance Report", icon: FileText, color: "bg-orange-500" },
                { name: "Risk Assessment", icon: FileText, color: "bg-red-500" },
                { name: "Performance Metrics", icon: BarChart3, color: "bg-cyan-500" }
              ].map((template, index) => {
                const Icon = template.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`${template.color} p-2 rounded-full text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{template.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.type} • {report.period}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {report.id}
                        </Badge>
                        <Badge 
                          variant={report.status === 'ready' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generated: {report.generated}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Size: {report.size}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      disabled={report.status !== 'ready'}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Interactive analytics dashboard</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Charts and graphs would be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
