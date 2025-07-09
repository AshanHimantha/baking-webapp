
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  MoreHorizontal,
  Shield,
  Activity
} from "lucide-react";

const AdminDashboard = () => {
  const kpiData = [
    {
      title: "Total Users",
      value: "12,457",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "Active Accounts",
      value: "9,842",
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900"
    },
    {
      title: "Total Deposits",
      value: "$2.4M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    },
    {
      title: "Flagged Activities",
      value: "23",
      change: "-5.2%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900"
    }
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      customer: "John Smith",
      amount: 2500.00,
      type: "deposit",
      status: "completed",
      date: "2024-01-09",
      time: "14:30",
      flag: null
    },
    {
      id: "TXN-002", 
      customer: "Sarah Wilson",
      amount: 150.75,
      type: "transfer",
      status: "completed",
      date: "2024-01-09",
      time: "14:25",
      flag: null
    },
    {
      id: "TXN-003",
      customer: "Mike Johnson",
      amount: 10000.00,
      type: "deposit",
      status: "pending",
      date: "2024-01-09",
      time: "14:20",
      flag: "high_amount"
    },
    {
      id: "TXN-004",
      customer: "Emma Davis",
      amount: 75.30,
      type: "withdrawal",
      status: "completed",
      date: "2024-01-09",
      time: "14:15",
      flag: null
    },
    {
      id: "TXN-005",
      customer: "Alex Chen",
      amount: 500.00,
      type: "transfer",
      status: "failed",
      date: "2024-01-09",
      time: "14:10",
      flag: "suspicious"
    }
  ];

  const pendingApprovals = [
    {
      id: "APP-001",
      type: "Account Opening",
      customer: "Robert Brown",
      submitted: "2024-01-09",
      priority: "high"
    },
    {
      id: "APP-002",
      type: "Credit Limit Increase",
      customer: "Lisa Taylor",
      submitted: "2024-01-08",
      priority: "medium"
    },
    {
      id: "APP-003",
      type: "Large Transaction",
      customer: "David Wilson",
      submitted: "2024-01-08",
      priority: "high"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor your banking operations and key metrics</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Activity className="w-4 h-4 mr-2" />
              System Status
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Shield className="w-4 h-4 mr-2" />
              Security Center
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="shadow-banking hover:shadow-banking-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                      <div className="flex items-center mt-1">
                        {kpi.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          kpi.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {kpi.change}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`${kpi.bgColor} p-3 rounded-full`}>
                      <Icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Transactions Chart */}
          <Card className="shadow-banking">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Daily Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Transaction Volume Chart</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Interactive chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Chart */}
          <Card className="shadow-banking">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Revenue Growth Chart</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Interactive chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2 shadow-banking">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/admin/transactions">View all</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100 dark:bg-green-900' :
                        transaction.type === 'withdrawal' ? 'bg-red-100 dark:bg-red-900' :
                        'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        ) : transaction.type === 'withdrawal' ? (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.customer}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.id} • {transaction.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Badge 
                          variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                        {transaction.flag && (
                          <Badge variant="destructive" className="text-xs">
                            {transaction.flag}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="shadow-banking">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Pending Approvals</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/admin/approvals">View all</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{approval.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{approval.customer}</p>
                      </div>
                      <Badge 
                        variant={approval.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {approval.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{approval.submitted}</p>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Core Banking</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Payment Gateway</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Fraud Detection</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Maintenance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
