
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  UserManagementAPI, 
  UserUtils, 
  type User, 
  type SearchFilters 
} from "@/lib/userManagementApi";

import { UserDetailsModal } from "@/components/admin/UserDetailsModal";
import { UserStatusBadge } from "@/components/admin/UserStatusBadge";

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 20;

  // Fetch users from API
  const fetchUsers = async (searchFilters: SearchFilters = {}) => {
    try {
      setSearchLoading(true);
      
      // If no filters, try to get all users first
      if (Object.keys(searchFilters).length === 0) {
        try {
          const allUsers = await UserManagementAPI.listAllUsers();
          setUsers(allUsers);
          setTotalCount(allUsers.length);
          setCurrentPage(1);
          setHasMore(false);
          return;
        } catch (error) {
          console.warn('Failed to fetch all users, falling back to search');
        }
      }
      
      const response = await UserManagementAPI.searchUsers({
        ...searchFilters,
        limit: ITEMS_PER_PAGE,
      });

      setUsers(response.users);
      setTotalCount(response.totalCount);
      setCurrentPage(response.page);
      setHasMore(response.hasMore);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Suspend user
  const suspendUser = async (username: string, reason: string) => {
    try {
      await UserManagementAPI.suspendUser(username, reason);
      
      toast({
        title: "Success",
        description: `User '${username}' has been suspended successfully.`,
      });
      
      // Refresh the user list
      fetchUsers(filters);
    } catch (error: any) {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to suspend user",
        variant: "destructive",
      });
    }
  };

  // Reactivate user
  const reactivateUser = async (username: string) => {
    try {
      await UserManagementAPI.reactivateUser(username);
      
      toast({
        title: "Success",
        description: `User '${username}' has been reactivated successfully.`,
      });
      
      // Refresh the user list
      fetchUsers(filters);
    } catch (error: any) {
      console.error('Error reactivating user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reactivate user",
        variant: "destructive",
      });
    }
  };

  // Handle search
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    const newFilters = {
      ...filters,
      username: searchValue || undefined,
      email: searchValue || undefined,
      page: 1
    };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await UserManagementAPI.exportUsers(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Users data exported successfully",
      });
    } catch (error: any) {
      console.error('Error exporting users:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to export users",
        variant: "destructive",
      });
    }
  };

  // Handle view user details
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const clearedFilters = { limit: ITEMS_PER_PAGE };
    setFilters(clearedFilters);
    setSearchTerm("");
    fetchUsers(clearedFilters);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PENDING': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor and manage customer accounts</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
           
          </div>
        </div>

      

        {/* Search and Stats */}
        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 shadow-banking">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers by username or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-banking">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : totalCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card className="shadow-banking">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Customers</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchUsers(filters)}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading customers...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={UserUtils.getProfilePictureUrl(user) || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {UserUtils.getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">{UserUtils.getFullName(user)}</p>
                          <div className={`w-2 h-2 rounded-full ${UserUtils.getStatusColor(user.status)}`}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{user.phoneNumber}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge variant="outline" className="text-xs">
                            @{user.username}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs text-white ${UserUtils.getAccountLevelColor(user.accountLevel)}`}
                          >
                            {user.accountLevel}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getKycStatusIcon(user.kycStatus)}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              KYC {user.kycStatus.toLowerCase()}
                            </span>
                          </div>
                          {user.emailVerified && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                              ✓ Email
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Status: {user.status}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {UserUtils.hasLoggedIn(user) ? 
                            `Last login: ${UserUtils.formatDateTime(user.lastLoginDate!)}` : 
                            'Never logged in'
                          }
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Joined: {UserUtils.getRegistrationDate(user)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col space-x-2 ">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="View Details"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                    
                        {user.status === 'SUSPENDED' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Reactivate User"
                            onClick={() => reactivateUser(user.username)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Suspend User"
                            onClick={() => suspendUser(user.username, "Manual suspension by admin")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                       
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && users.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No customers found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}

            {/* Pagination info */}
            {!loading && users.length > 0 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {users.length} of {totalCount.toLocaleString()} customers
                </p>
                {hasMore && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const nextPage = currentPage + 1;
                      const newFilters = { ...filters, page: nextPage };
                      setFilters(newFilters);
                      fetchUsers(newFilters);
                    }}
                    disabled={searchLoading}
                  >
                    {searchLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Load More
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={showUserDetails}
          onClose={() => setShowUserDetails(false)}
          onSuspend={suspendUser}
          onReactivate={reactivateUser}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
