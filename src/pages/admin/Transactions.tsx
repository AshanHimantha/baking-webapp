
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight
} from "lucide-react";
import { useState } from "react";

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const transactions = [
    {
      id: "TXN-001",
      customer: "John Smith",
      amount: 2500.00,
      type: "deposit",
      status: "completed",
      date: "2024-01-09",
      time: "14:30",
      fee: 0.00,
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
      fee: 2.50,
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
      fee: 0.00,
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
      fee: 1.00,
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
      fee: 2.50,
      flag: "suspicious"
    }
  ];

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'transfer': return <ArrowLeftRight className="w-4 h-4 text-blue-600" />;
      default: return <ArrowLeftRight className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionBg = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-green-100 dark:bg-green-900';
      case 'withdrawal': return 'bg-red-100 dark:bg-red-900';
      case 'transfer': return 'bg-blue-100 dark:bg-blue-900';
      default: return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Monitor</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor all banking transactions and detect fraud</p>
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

        {/* Search and Summary */}
        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-2 shadow-banking">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-red-600">
                {transactions.filter(t => t.flag).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className={`p-4 rounded-lg border transition-colors ${
                  transaction.flag 
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getTransactionBg(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.customer}</p>
                          {transaction.flag && (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.id} • {transaction.type}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
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
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Fee: ${transaction.fee.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {transaction.date} {transaction.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
