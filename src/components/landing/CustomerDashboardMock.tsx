import React, { useEffect, useState } from "react";
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
  Bell,
  Home,
  User,
  LogOut,
  Settings,
} from "lucide-react";

// --- 1. UTILITY HOOK for Responsive Design (IMPROVED) ---
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    // Set the initial state
    setMatches(media.matches);

    // Create a listener for changes
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    // Cleanup the listener on component unmount
    return () => media.removeEventListener("change", listener);
  }, [query]); // Effect only re-runs if the query string changes

  return matches;
};

// --- MOCK UI COMPONENTS (Shared by both Mobile and Desktop) ---
const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border rounded-lg bg-white ${className || ""}`}>
    {children}
  </div>
);
const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-4 ${className || ""}`}>{children}</div>;
const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`font-semibold text-lg text-gray-900 ${className || ""}`}>
    {children}
  </h3>
);
const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-4 pt-0 ${className || ""}`}>{children}</div>;
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  asChild,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyle =
    variant === "ghost"
      ? "text-gray-700 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeStyle = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    icon: "h-10 w-10",
  }[size || "default"];
  const Component = asChild ? "a" : "button";
  return (
    <Component
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className || ""}`}
      {...props}
    >
      {children}
    </Component>
  );
};
const Avatar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ${
      className || ""
    }`}
  >
    {children}
  </div>
);
const AvatarFallback = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-800 ${
      className || ""
    }`}
  >
    {children}
  </span>
);
const AvatarImage = ({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full ${className || ""}`}
  />
);
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const trigger = React.Children.toArray(children)[0] as React.ReactElement;
  const content = React.Children.toArray(children)[1] as React.ReactElement;
  return (
    <div className="relative">
      {React.cloneElement(trigger, { onClick: () => setIsOpen((p) => !p) })}
      {isOpen && content}
    </div>
  );
};
const DropdownMenuTrigger = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => <div onClick={onClick}>{children}</div>;
const DropdownMenuContent = ({
  children,
  align,
  className,
}: {
  children: React.ReactNode;
  align?: string;
  className?: string;
}) => (
  <div
    className={`absolute mt-2 w-56 rounded-md border bg-white p-1 text-gray-900 shadow-lg z-50 ${
      align === "end" ? "right-0" : "left-0"
    } ${className || ""}`}
  >
    {children}
  </div>
);
const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    onClick={onClick}
    className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 ${
      className || ""
    }`}
  >
    {children}
  </div>
);
const DropdownMenuSeparator = ({ className }: { className?: string }) => (
  <div className={`-mx-1 my-1 h-px bg-gray-200 ${className || ""}`} />
);
const transactionTypeIcon = {
  BILL_PAYMENT: Receipt,
  TRANSFER: ArrowLeftRight,
  DEPOSIT: TrendingUp,
  WITHDRAWAL: TrendingDown,
  INTEREST_PAYOUT: TrendingUp,
};

// --- 2. DESKTOP-ONLY COMPONENT (Unchanged) ---
const DesktopDashboard = ({
  user,
  accounts,
  totalBalance,
  balanceVisible,
  setBalanceVisible,
  navigation,
  isAdminOrEmployee,
  recentTransactions,
  AccountCarouselContent,
  displayUserInitials,
  displayUserName,
}: any) => (
  <div className="h-screen flex flex-row bg-gray-50 font-sans text-gray-800">
    <aside className="flex flex-col w-64 border-r border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 flex-shrink-0">
        <img src="/orbinw.png" alt="Logo" className="h-10 w-auto" />
      </div>
      <nav className="flex-1 mt-6 px-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item: any) => {
            const Icon = item.icon;
            const isActive = item.name === "Dashboard";
            return (
              <div
                key={item.name}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-blue-600/10 text-blue-600 border border-blue-600/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </nav>
      <div className="p-3 border-t border-gray-200">
        <div className="bg-gray-100 rounded-md p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {user.hasAvatar ? (
                <AvatarImage src={user.avatarUrl} />
              ) : (
                <AvatarFallback>{displayUserInitials}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{displayUserName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <div className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between h-16 px-6">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-9 w-9">
                    {user.hasAvatar ? (
                      <AvatarImage src={user.avatarUrl} />
                    ) : (
                      <AvatarFallback>{displayUserInitials}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  <p className="font-medium">{displayUserName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {isAdminOrEmployee && (
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Good morning, {user.firstName}! 👋
            </h1>
            <p className="text-base text-gray-500 mt-2">
              Here's your financial overview for today
            </p>
          </div>
          <Card className="relative bg-gradient-to-l from-orange-700 via-yellow-600 to-orange-500 text-white shadow-lg">
            <div className="relative z-10 p-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white">
                    Total Balance
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                  >
                    {balanceVisible ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold">
                  {balanceVisible
                    ? `$${totalBalance.toLocaleString()}`
                    : "••••••••"}
                </div>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {accounts.length} accounts
                </div>
              </CardContent>
            </div>
          </Card>
          {AccountCarouselContent}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx: any) => {
                  const Icon = transactionTypeIcon[tx.transactionType];
                  const isDeposit = tx.transactionType === "DEPOSIT";
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`${
                            isDeposit
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          } p-3 rounded-full`}
                        >
                          <Icon />
                        </div>
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(tx.transactionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-semibold ${
                          isDeposit ? "text-green-600" : ""
                        }`}
                      >
                        {isDeposit ? "+" : "-"}${tx.amount.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  </div>
);

// --- 3. MOBILE-ONLY COMPONENT (FIXED) ---
const MobileDashboard = ({
  user,
  accounts,
  totalBalance,
  balanceVisible,
  setBalanceVisible,
  navigation,
  isAdminOrEmployee,
  recentTransactions,
  AccountCarouselContent,
  displayUserInitials,
  displayUserName,
}: any) => (
  


  <div className="flex flex-col h-screen w-full bg-gray-black font-sans text-gray-800">
    <header
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex-shrink-0"

     
    >
      <div className="flex items-center justify-between h-16 px-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar>
                  {user.hasAvatar ? (
                    <AvatarImage src={user.avatarUrl} />
                  ) : (
                    <AvatarFallback>{displayUserInitials}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">
                <p className="font-medium text-sm">{displayUserName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              {isAdminOrEmployee && (
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    <main className="flex-1 p-4 overflow-y-auto pb-20">
      {/* The pb-20 (5rem) is important. It ensures the content at the bottom of the page
          isn't hidden behind the fixed footer, which has a height of h-16 (4rem). */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user.firstName}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's your overview.</p>
        </div>
        <Card className="relative bg-gradient-to-l from-orange-700 via-yellow-600 to-orange-500 text-white shadow-lg">
          <div className="relative z-10 p-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-white">
                  Total Balance
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                >
                  {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {balanceVisible
                  ? `$${totalBalance.toLocaleString()}`
                  : "••••••••"}
              </div>
              <div className="flex items-center text-sm mt-1">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                {accounts.length} accounts
              </div>
            </CardContent>
          </div>
        </Card>
        {AccountCarouselContent}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx: any) => {
                const Icon = transactionTypeIcon[tx.transactionType];
                const isDeposit = tx.transactionType === "DEPOSIT";
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`${
                          isDeposit
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        } p-2 rounded-full`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.transactionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold text-sm ${
                        isDeposit ? "text-green-600" : ""
                      }`}
                    >
                      {isDeposit ? "+" : "-"}${tx.amount.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>

    <footer
      className="mb-14 w-full left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-10"

     
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navigation.map((item: any) => {
          const Icon = item.icon;
          const isActive = item.name === "Dashboard";
          return (
            <div
              key={item.name}
              className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors cursor-pointer ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </div>
          );
        })}
      </div>
    </footer>
  </div>
 
);

// --- 4. PARENT CONTAINER COMPONENT (Unchanged) ---
const CustomerDashboardPage = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [userProfile] = useState({
    firstName: "Ashan",
    lastName: "Himantha",
    username: "AshanXD",
    email: "ashanhimantha@gmail.com",
    hasAvatar: true,
    avatarUrl: "/user.jpg",
    roles: ["CUSTOMER"],
  });
  const [accounts] = useState([
    {
      accountNumber: "**********1234",
      accountType: "SAVING",
      balance: 15234.56,
      backgroundImage:
        "linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
      iconColor: "text-green-300",
    },
    {
      accountNumber: "**********5678",
      accountType: "CURRENT",
      balance: 5678.9,
      backgroundImage:
        "linear-gradient(to right top, #001007, #002e1c, #004d3e, #006c64, #008c8b)",
      iconColor: "text-blue-300",
    },
  ]);
  const [recentTransactions] = useState([
    {
      id: "tx1",
      transactionType: "TRANSFER",
      description: "Online Shopping",
      amount: 150.75,
      transactionDate: new Date().toISOString(),
    },
    {
      id: "tx2",
      transactionType: "DEPOSIT",
      description: "Payroll Deposit",
      amount: 3200.0,
      transactionDate: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const navigation = [
    { name: "Dashboard", href: "#", icon: Home },
    { name: "Transfer", href: "#", icon: ArrowLeftRight },
    { name: "Transactions", href: "#", icon: Receipt },
    { name: "Cards", href: "#", icon: CreditCard },
    { name: "Profile", href: "#", icon: User },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const displayUserName = `${userProfile.firstName} ${userProfile.lastName}`;
  const displayUserInitials =
    `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
  const isAdminOrEmployee = userProfile.roles.includes("ADMIN");

  const AccountCarouselContent = React.useMemo(
    () => (
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Your Accounts</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {accounts.map((account) => (
              <div
                key={account.accountNumber}
                className="flex-none w-64 h-40 rounded-xl shadow-md p-4 flex flex-col justify-between text-white"
                style={{ background: account.backgroundImage }}
              >
                <div className="flex justify-between items-start">
                  <CreditCard className={account.iconColor} />
                  <span className="font-semibold">{account.accountType}</span>
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {balanceVisible
                      ? `$${account.balance.toLocaleString()}`
                      : "••••••••"}
                  </p>
                  <p className="text-sm opacity-80">{account.accountNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ),
    [balanceVisible, accounts]
  );

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const dashboardProps = {
    user: userProfile,
    accounts,
    totalBalance,
    balanceVisible,
    setBalanceVisible,
    navigation,
    isAdminOrEmployee,
    recentTransactions,
    AccountCarouselContent,
    displayUserInitials,
    displayUserName,
  };

  return isDesktop ? (
    <DesktopDashboard {...dashboardProps} />
  ) : (
    <MobileDashboard {...dashboardProps} />
  );
};

export default CustomerDashboardPage;
