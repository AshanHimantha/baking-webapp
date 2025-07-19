
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
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get("/api/admin/dashboard/summary")
      .then(res => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load dashboard summary");
        setLoading(false);
      });
  }, []);

  // KPI config using API data
  const kpiData = summary ? [
    {
      title: "Total Users",
      value: summary.totalUsers,
      change: undefined, // No change % in API
      trend: undefined,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "Active Accounts",
      value: summary.totalAccounts,
      change: undefined,
      trend: undefined,
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900"
    },
    {
      title: "System Assets",
      value: `$${Number(summary.totalSystemAssets).toLocaleString()}`,
      change: undefined,
      trend: undefined,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    },
    {
      title: "Transactions Today",
      value: summary.transactionsToday,
      change: undefined,
      trend: undefined,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900"
    }
  ] : [];

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

        {/* Loading/Error State */}
        {loading && (
          <div className="text-center py-10 text-gray-500">Loading dashboard...</div>
        )}
        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {/* KPI Cards */}
        {!loading && !error && (
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
        )}

        {/* Charts Row */}
        {!loading && !error && summary && (
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
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex flex-col items-center justify-center">
                  {/* Improved chart representation */}
                  {(() => {
                    const data = summary.transactionVolumeChart.data;
                    const labels = summary.transactionVolumeChart.labels;
                    const maxVal = Math.max(...data);
                    const maxBarHeight = 100; // px
                    return (
                      <div className="w-full flex items-end h-32 gap-2 px-4">
                        {data.map((val, idx) => {
                          let barHeight = maxVal > 0 ? (val / maxVal) * maxBarHeight : 8;
                          if (isNaN(barHeight) || barHeight < 8) barHeight = 8;
                          return (
                            <div key={idx} className="flex flex-col items-center w-8">
                              <div
                                className="bg-blue-400 rounded-t"
                                style={{ height: `${barHeight}px`, width: '100%' }}
                              ></div>
                              <span className="text-xs mt-1 text-gray-500">{labels[idx].slice(4)}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <p className="text-gray-600 dark:text-gray-400 mt-4">Transaction Volume (last 7 days)</p>
                </div>
              </CardContent>
            </Card>

            {/* New Users Chart */}
            <Card className="shadow-banking">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">New Users</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg flex flex-col items-center justify-center">
                  {/* Improved chart representation */}
                  {(() => {
                    const data = summary.newUsersChart.data;
                    const labels = summary.newUsersChart.labels;
                    const maxVal = Math.max(...data);
                    const maxBarHeight = 100; // px
                    return (
                      <div className="w-full flex items-end h-32 gap-2 px-4">
                        {data.map((val, idx) => {
                          let barHeight = maxVal > 0 ? (val / maxVal) * maxBarHeight : 8;
                          if (isNaN(barHeight) || barHeight < 8) barHeight = 8;
                          return (
                            <div key={idx} className="flex flex-col items-center w-8">
                              <div
                                className="bg-green-400 rounded-t"
                                style={{ height: `${barHeight}px`, width: '100%' }}
                              ></div>
                              <span className="text-xs mt-1 text-gray-500">{labels[idx].slice(4)}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <p className="text-gray-600 dark:text-gray-400 mt-4">New Users (last 7 days)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tables Row, System Status, etc. (unchanged) */}
        {/* ...existing code... */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
