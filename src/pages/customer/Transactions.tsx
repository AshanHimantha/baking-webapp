
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Coffee,
  Zap,
  Car,
  ShoppingBag,
  TrendingUp,
  Home,
  Utensils,
  Gamepad2
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CustomerTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const transactions = [
    {
      id: '001',
      type: 'expense',
      merchant: 'Starbucks Coffee',
      amount: 12.50,
      date: '2024-01-09',
      time: '08:30 AM',
      category: 'Food & Drink',
      status: 'completed',
      icon: Coffee,
      color: 'bg-amber-500',
      description: 'Morning coffee and pastry'
    },
    {
      id: '002',
      type: 'income',
      merchant: 'Salary Deposit',
      amount: 3500.00,
      date: '2024-01-08',
      time: '12:00 PM',
      category: 'Income',
      status: 'completed',
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Monthly salary payment'
    },
    {
      id: '003',
      type: 'expense',
      merchant: 'Electric Company',
      amount: 89.32,
      date: '2024-01-07',
      time: '02:15 PM',
      category: 'Bills',
      status: 'completed',
      icon: Zap,
      color: 'bg-yellow-500',
      description: 'Monthly electricity bill'
    },
    {
      id: '004',
      type: 'expense',
      merchant: 'Shell Gas Station',
      amount: 45.20,
      date: '2024-01-07',
      time: '10:45 AM',
      category: 'Transport',
      status: 'completed',
      icon: Car,
      color: 'bg-blue-500',
      description: 'Fuel refill'
    },
    {
      id: '005',
      type: 'expense',
      merchant: 'Amazon Purchase',
      amount: 67.89,
      date: '2024-01-06',
      time: '06:20 PM',
      category: 'Shopping',
      status: 'completed',
      icon: ShoppingBag,
      color: 'bg-purple-500',
      description: 'Electronics accessories'
    },
    {
      id: '006',
      type: 'expense',
      merchant: 'Rent Payment',
      amount: 1200.00,
      date: '2024-01-05',
      time: '09:00 AM',
      category: 'Housing',
      status: 'completed',
      icon: Home,
      color: 'bg-indigo-500',
      description: 'Monthly rent payment'
    },
    {
      id: '007',
      type: 'expense',
      merchant: 'Pizza Palace',
      amount: 28.75,
      date: '2024-01-05',
      time: '07:30 PM',
      category: 'Food & Drink',
      status: 'completed',
      icon: Utensils,
      color: 'bg-red-500',
      description: 'Dinner with friends'
    },
    {
      id: '008',
      type: 'expense',
      merchant: 'Steam Store',
      amount: 19.99,
      date: '2024-01-04',
      time: '11:15 PM',
      category: 'Entertainment',
      status: 'pending',
      icon: Gamepad2,
      color: 'bg-cyan-500',
      description: 'Video game purchase'
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Food & Drink', 'Bills', 'Transport', 'Shopping', 'Housing', 'Income', 'Entertainment'];

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-gray-600 dark:text-gray-400">Track all your financial activities</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-banking">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredTransactions.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  ${filteredTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Received</p>
                <p className="text-2xl font-bold text-green-600">
                  ${filteredTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`${transaction.color} p-3 rounded-full text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.merchant}</p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-gray-400">ID: {transaction.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-lg ${
                        transaction.type === 'income' 
                          ? 'text-green-600' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      <p className="text-xs text-gray-400">{transaction.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransactions;
