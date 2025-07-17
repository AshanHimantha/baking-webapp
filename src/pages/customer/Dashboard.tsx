import { useEffect, useState } from "react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Plus,
  CreditCard,
  ArrowLeftRight,
  Receipt,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import AccountCarousel from "@/components/customer/AccountCarousel"; // Import the new component
import { useUserStore } from '@/store/userStore';

const transactionTypeIcon = {
  BILL_PAYMENT: Receipt,
  TRANSFER: ArrowLeftRight,
  DEPOSIT: TrendingUp,
  WITHDRAWAL: TrendingDown,
  INTEREST_PAYOUT: TrendingUp,
};

const accountTypeColor = {
  CURRENT: "bg-banking-primary",
  FIXED: "bg-banking-warning",
  SAVING: "bg-banking-success",
};

const CustomerDashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userProfile = useUserStore((state) => state.userProfile);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const proDetails = useUserStore((state) => state.isLoading);



  // const quickActions = [
  //   {
  //     name: "Transfer",
  //     icon: ArrowLeftRight,
  //     color: "bg-banking-primary",
  //     href: "/customer/transfer",
  //   },
  //   {
  //     name: "Pay Bills",
  //     icon: Receipt,
  //     color: "bg-banking-success",
  //     href: "/customer/transfer",
  //   },
  //   {
  //     name: "Add Money",
  //     icon: Plus,
  //     color: "bg-purple-500",
  //     href: "/customer/cards",
  //   },
  //   {
  //     name: "Cards",
  //     icon: CreditCard,
  //     color: "bg-banking-warning",
  //     href: "/customer/cards",
  //   },
  // ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get("/api/dashboard");
        setAccounts(res.data.accounts || []);
        setRecentTransactions(res.data.recentTransactions || []);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);



  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  );

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-background rounded-lg border font-geist">
        <div className="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <div className="animate-fade-in">

            {loading ? (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 mt-4">
                Loading...
              </h1>
            ) : (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 mt-4">
                Good morning, {userProfile.firstName}! 👋
              </h1>
            )}

            <p className="text-sm sm:text-base text-muted-foreground">
              Here's your financial overview for today
            </p>
          </div>

          {/* Total Balance Card */}
          <Card className="relative bg-gradient-to-l from-orange-700 via-yellow-600  to-orange-500 text-white shadow-banking-lg animate-slide-in overflow-hidden">
            <div className="w-full h-full absolute inset-0">
              <div className="w-full h-full bg-[url('/R.jpg')] bg-cover bg-center bg-no-repeat opacity-5"></div>
            </div>
            {/* ===== Animated Background Bubbles ===== */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
              <div
                className="absolute -bottom-20 -right-8 w-40 h-40 bg-white/10 rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute -top-4 -right-12 w-24 h-24 bg-white/5 rounded-full animate-pulse"
                style={{ animationDelay: "4s" }}
              ></div>
            </div>

            {/* ===== Card Content (must have relative z-10) ===== */}
            <div className="relative z-10 ">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg font-medium">
                    Total Balance
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0 flex-shrink-0"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                  >
                    {balanceVisible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                    {balanceVisible
                      ? `$${totalBalance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "••••••••"}
                  </div>
                  <div className="flex items-center space-x-2 text-orange-100">
                    <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {accounts.length > 0
                        ? `${accounts.length} account${
                            accounts.length > 1 ? "s" : ""
                          }`
                        : "No accounts"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* NEW: Account Carousel */}
          <AccountCarousel accounts={accounts} />

          {/* Quick Actions */}
          {/* <Card className="shadow-banking">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.name}
                      variant="outline"
                      className="h-auto p-4 sm:p-6 flex flex-col items-center justify-center space-y-2 sm:space-y-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-border"
                      asChild
                    >
                      <a href={action.href}>
                        <div
                          className={`${action.color} p-3 sm:p-4 rounded-full text-white`}
                        >
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                          {action.name}
                        </span>
                      </a>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card> */}

          {/* Recent Transactions */}
          <Card className="shadow-banking">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Recent Transactions
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-sm">
                <a href="/customer/transactions">View all</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  <div className="text-muted-foreground text-center py-8">
                    Loading transactions...
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    No recent transactions found.
                  </div>
                ) : (
                  recentTransactions.map((transaction) => {
                    const Icon =
                      transactionTypeIcon[transaction.transactionType] ||
                      Receipt;
                    const relatedAccount = accounts.find(
                      (a) =>
                        a.accountNumber === transaction.fromAccountNumber ||
                        a.accountNumber === transaction.toAccountNumber
                    );
                    const color = relatedAccount
                      ? accountTypeColor[relatedAccount.accountType]
                      : "bg-gray-400";
                    const isDeposit =
                      transaction.transactionType === "DEPOSIT" ||
                      transaction.transactionType === "INTEREST_PAYOUT";

                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div
                            className={`${color} p-2 sm:p-3 rounded-full text-white flex-shrink-0`}
                          >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base text-foreground truncate">
                              {transaction.description}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {transaction.userMemo || transaction.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p
                            className={`font-semibold text-sm sm:text-base ${
                              isDeposit
                                ? "text-banking-success"
                                : "text-foreground"
                            }`}
                          >
                            {isDeposit ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(
                              transaction.transactionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* <Card className="shadow-banking">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Spending Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
                <div className="text-center px-4">
                  <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg text-muted-foreground mb-2">Spending chart visualization</p>
                  <p className="text-sm text-muted-foreground/70">An interactive chart will be displayed here.</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
