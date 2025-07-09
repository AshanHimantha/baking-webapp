
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Home, 
  ArrowLeftRight, 
  CreditCard, 
  User, 
  Receipt, 
  Menu, 
  X,
  Sun,
  Moon,
  LogOut,
  Building2
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { name: 'Transactions', href: '/customer/transactions', icon: Receipt },
    { name: 'Transfer', href: '/customer/transfer', icon: ArrowLeftRight },
    { name: 'Cards', href: '/customer/cards', icon: CreditCard },
    { name: 'Profile', href: '/customer/profile', icon: User },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background font-geist">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Building2 className="w-7 h-7 lg:w-8 lg:h-8 text-banking-primary" />
            <span className="text-lg lg:text-xl font-bold text-foreground">MyBank</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-4 lg:mt-6 px-3 lg:px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 lg:py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isCurrentPath(item.href)
                      ? 'bg-banking-primary/10 text-banking-primary border border-banking-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom of sidebar */}
        <div className="absolute bottom-4 lg:bottom-6 left-0 right-0 px-3 lg:px-6">
          <div className="bg-muted rounded-xl p-3 lg:p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-banking-primary text-white text-sm lg:text-base">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  John Doe
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 -ml-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="ml-2 lg:ml-0 text-lg lg:text-xl font-semibold text-foreground truncate">
                {navigation.find(item => isCurrentPath(item.href))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : (
                  <Sun className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-destructive rounded-full"></span>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 lg:h-9 lg:w-9 rounded-full p-0">
                    <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                      <AvatarImage src="/placeholder.svg" alt="@johndoe" />
                      <AvatarFallback className="bg-banking-primary text-white text-sm">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 lg:w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">John Doe</p>
                      <p className="w-[180px] lg:w-[200px] truncate text-xs text-muted-foreground">
                        john@example.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/customer/profile" className="cursor-pointer text-sm">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive text-sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border lg:hidden z-40 pb-safe-bottom">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-banking-primary bg-banking-primary/10'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium truncate w-full text-center">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
