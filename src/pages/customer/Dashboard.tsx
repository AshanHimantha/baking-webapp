
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  CreditCard, 
  ArrowLeftRight,
  Receipt,
  Coffee,
  Zap,
  Car,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";

const CustomerDashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const quickActions = [
    { name: 'Transfer', icon: ArrowLeftRight, color: 'bg-blue-500', href: '/customer/transfer' },
    { name: 'Pay Bills', icon: Receipt, color: 'bg-green-500', href: '/customer/transactions' },
    { name: 'Add Money', icon: Plus, color: 'bg-purple-500', href: '/customer/cards' },
    { name: 'Cards', icon: CreditCard, color: 'bg-orange-500', href: '/customer/cards' },
  ];

  const recentTransactions = [
    {
      id: '1',
      type: 'expense',
      merchant: 'Starbucks Coffee',
      amount: 12.50,
      date: '2024-01-09',
      category: 'Food & Drink',
      icon: Coffee,
      color: 'bg-amber-500'
    },
    {
      id: '2',
      type: 'income',
      merchant: 'Salary Deposit',
      amount: 3500.00,
      date: '2024-01-08',
      category: 'Income',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      id: '3',
      type: 'expense',
      merchant: 'Electric Company',
      amount: 89.32,
      date: '2024-01-07',
      category: 'Bills',
      icon: Zap,
      color: 'bg-yellow-500'
    },
    {
      id: '4',
      type: 'expense',
      merchant: 'Gas Station',
      amount: 45.20,
      date: '2024-01-07',
      category: 'Transport',
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      id: '5',
      type: 'expense',
      merchant: 'Amazon Purchase',
      amount: 67.89,
      date: '2024-01-06',
      category: 'Shopping',
      icon: ShoppingBag,
      color: 'bg-purple-500'
    },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Good morning, John! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your financial overview for today
          </p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-banking-lg animate-slide-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                onClick={() => setBalanceVisible(!balanceVisible)}
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {balanceVisible ? '$12,847.56' : '••••••••'}
              </div>
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">+$1,240 this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Income</p>
                  <p className="text-2xl font-bold text-green-600">$4,250.00</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+12% from last month</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expenses</p>
                  <p className="text-2xl font-bold text-red-600">$2,180.45</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">-5% from last month</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings</p>
                  <p className="text-2xl font-bold text-blue-600">$2,069.55</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+18% from last month</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.name}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    asChild
                  >
                    <a href={action.href}>
                      <div className={`${action.color} p-3 rounded-full text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium">{action.name}</span>
                    </a>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-banking">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <a href="/customer/transactions">View all</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`${transaction.color} p-2 rounded-full text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.merchant}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-green-600' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Spending Chart Placeholder */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Spending chart visualization</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Interactive chart would be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
