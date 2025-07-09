
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
    { name: 'Transfer', icon: ArrowLeftRight, color: 'bg-banking-primary', href: '/customer/transfer' },
    { name: 'Pay Bills', icon: Receipt, color: 'bg-banking-success', href: '/customer/transactions' },
    { name: 'Add Money', icon: Plus, color: 'bg-purple-500', href: '/customer/cards' },
    { name: 'Cards', icon: CreditCard, color: 'bg-banking-warning', href: '/customer/cards' },
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
      color: 'bg-banking-success'
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
      color: 'bg-banking-primary'
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
      <div className="space-y-4 lg:space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-1 lg:mb-2">
            Good morning, John! 👋
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Here's your financial overview for today
          </p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-banking-primary to-banking-primaryDark text-white shadow-banking-lg animate-slide-in overflow-hidden">
          <CardHeader className="pb-3 lg:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base lg:text-lg font-medium">Total Balance</CardTitle>
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
            <div className="space-y-2 lg:space-y-3">
              <div className="text-2xl lg:text-3xl xl:text-4xl font-bold">
                {balanceVisible ? '$12,847.56' : '••••••••'}
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4 text-blue-100">
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm">+$1,240 this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <Card className="shadow-banking">
            <CardContent className="pt-4 lg:pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Income</p>
                  <p className="text-lg lg:text-2xl font-bold text-banking-success truncate">$4,250.00</p>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </div>
                <div className="bg-banking-success/10 p-2 lg:p-3 rounded-full flex-shrink-0">
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-banking-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-4 lg:pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Expenses</p>
                  <p className="text-lg lg:text-2xl font-bold text-banking-expense truncate">$2,180.45</p>
                  <p className="text-xs text-muted-foreground mt-1">-5% from last month</p>
                </div>
                <div className="bg-banking-expense/10 p-2 lg:p-3 rounded-full flex-shrink-0">
                  <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-banking-expense" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-4 lg:pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Savings</p>
                  <p className="text-lg lg:text-2xl font-bold text-banking-primary truncate">$2,069.55</p>
                  <p className="text-xs text-muted-foreground mt-1">+18% from last month</p>
                </div>
                <div className="bg-banking-primary/10 p-2 lg:p-3 rounded-full flex-shrink-0">
                  <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-banking-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.name}
                    variant="outline"
                    className="h-auto p-3 lg:p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-border"
                    asChild
                  >
                    <a href={action.href}>
                      <div className={`${action.color} p-2 lg:p-3 rounded-full text-white`}>
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-center">{action.name}</span>
                    </a>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-banking">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 lg:pb-4">
            <CardTitle className="text-base lg:text-lg">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs lg:text-sm">
              <a href="/customer/transactions">View all</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 lg:space-y-3">
              {recentTransactions.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-2 lg:p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`${transaction.color} p-1.5 lg:p-2 rounded-full text-white flex-shrink-0`}>
                        <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm lg:text-base text-foreground truncate">{transaction.merchant}</p>
                        <p className="text-xs lg:text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-semibold text-sm lg:text-base ${
                        transaction.type === 'income' 
                          ? 'text-banking-income' 
                          : 'text-foreground'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
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
            <CardTitle className="text-base lg:text-lg">Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 lg:h-64 bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm lg:text-base text-muted-foreground">Spending chart visualization</p>
                <p className="text-xs lg:text-sm text-muted-foreground/70">Interactive chart would be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
