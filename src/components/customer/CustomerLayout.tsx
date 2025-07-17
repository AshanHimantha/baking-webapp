import { useState, useEffect } from "react"; // Add useEffect
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Building2,
  Settings,
  Loader2 // Import Loader2 for loading spinner
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from '@/store/userStore'; // Import your user store
import { toast } from 'sonner'; // Import toast for error notifications

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Use useAuthStore for authentication actions (logout, initial role check for ProtectedRoute)
  const { logout } = useAuthStore();

  // Use useUserStore for detailed user profile data
  const { userProfile, isLoading, error, fetchUserProfile } = useUserStore();

  useEffect(() => {
    if (!userProfile && !isLoading) { // Only fetch if no profile and not already loading
      fetchUserProfile();
    }
    if (error) {
      toast.error(error); // Show error from store
    }
  }, [userProfile, isLoading, error, fetchUserProfile]);


  // --- Derived values from userProfile, with fallbacks ---
  const displayUserName = userProfile?.firstName && userProfile?.lastName
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : userProfile?.username || 'Guest User'; // Fallback to username or 'Guest'
  const displayUserEmail = userProfile?.email || 'guest@example.com';
  const displayUserInitials = userProfile?.firstName && userProfile?.lastName
    ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase()
    : displayUserName.split(' ').map(n => n[0]).join('').toUpperCase() || 'GU'; // Handle single name or no name

  const displayAvatarUrl = userProfile?.avatarUrl
    ? import.meta.env.VITE_API_BASE_URL + userProfile.avatarUrl
    : undefined; // AvatarImage handles undefined better than an invalid string

  // Determine if user has ADMIN or EMPLOYEE role from userProfile
  const isAdminOrEmployee = userProfile?.roles?.includes('ADMIN') || userProfile?.roles?.includes('EMPLOYEE');

  // --- End Derived values ---

  const navigation = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { name: 'Transfer', href: '/customer/transfer', icon: ArrowLeftRight },
    { name: 'Transactions', href: '/customer/transactions', icon: Receipt },
    { name: 'Cards', href: '/customer/cards', icon: CreditCard },
    { name: 'Profile', href: '/customer/profile', icon: User },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // --- Loading and Error states for the layout ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-banking-primary" />
        <p className="ml-2 text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  // If there's an error and no profile, you might want to redirect or show a specific message
  if (error && !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Profile</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => navigate('/signin')}>Go to Sign In</Button>
      </div>
    );
  }

  // If userProfile is still null despite not being in loading/error state
  // (e.g., if token invalid and profile was cleared, but ProtectedRoute didn't catch it yet)
  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <h2 className="text-xl font-bold text-gray-700 mb-2">No Profile Data</h2>
        <p className="text-gray-600 mb-4">You might not be logged in or your session has expired.</p>
        <Button onClick={() => navigate('/signin')}>Sign In</Button>
      </div>
    );
  }
  // --- End Loading and Error states ---


  return (
    <div className="h-screen flex bg-background font-geist overflow-hidden ">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed  inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed  inset-y-0 left-0 z-50 w-64  border-r  bg-white dark:bg-slate-800 border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between  h-16 px-4 lg:px-6 border-b border-border flex-shrink-0 ">
          <div className="flex items-center ">
            <img src="/orbinw.png" alt="Logo" className="h-10 " />
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

        <nav className="flex-1 mt-4 lg:mt-6 px-3 lg:px-4 overflow-y-auto ">
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
        <div className="p-3 lg:p-3 border-t border-border flex-shrink-0 ">
          <div className="bg-muted rounded-md p-3 lg:p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                {userProfile?.hasAvatar && displayAvatarUrl ? (
                  <AvatarImage src={displayAvatarUrl} alt={`@${displayUserName.toLowerCase().replace(' ', '')}`} />
                ) : (
                  <AvatarFallback className="bg-banking-primary text-white text-sm lg:text-base">{displayUserInitials}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {displayUserName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {displayUserEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-blue-100/20 ">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border flex-shrink-0">
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
              <div>
              <h1 className="ml-2 lg:ml-0 text-lg lg:text-xl font-semibold text-foreground truncate">
                {navigation.find(item => isCurrentPath(item.href))?.name || 'Dashboard'}
              </h1>

</div>
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
                  <Sun className="w-4 h-4 lg:w-5 h-5" />
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
                      {userProfile?.hasAvatar && displayAvatarUrl ? (
                        <AvatarImage src={displayAvatarUrl} alt={`@${displayUserName.toLowerCase().replace(' ', '')}`} />
                      ) : (
                        <AvatarFallback className="bg-banking-primary text-white text-sm">{displayUserInitials}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 lg:w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{displayUserName}</p>
                      <p className="w-[180px] lg:w-[200px] truncate text-xs text-muted-foreground">
                        {displayUserEmail}
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
                  {isAdminOrEmployee && ( // Conditionally render based on isAdminOrEmployee
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer text-sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive text-sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-y-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border lg:hidden z-40 pb-safe-bottom bg-white">
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