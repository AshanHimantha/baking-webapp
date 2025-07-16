
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  LogOut,
  Settings,
  Users,
  Key,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { ProfileAPI, ProfileUpdateDTO, ProfileUtils, UserProfileData } from "@/lib/profileApi";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { logout, getUser, isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user data directly from auth store as fallback
  const user = getUser();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: true,
    auditLogging: true
  });

  // Helper functions
  const getDisplayName = () => {
    if (!user) return 'Unknown User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.sub;
  };

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  };

  const getRoleName = () => {
    if (!user || !user.roles || user.roles.length === 0) return 'User';
    const role = user.roles[0];
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'EMPLOYEE':
        return 'Employee';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return 'User';
    }
  };

  // Show loading if not authenticated
  if (!isAuthenticated()) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  // Update form data when user changes
  useEffect(() => {
    try {
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: '', // This might come from a separate profile API call
          role: getRoleName()
        });
      }
    } catch (error) {
      console.error('Error updating form data:', error);
    }
  }, [user]);

  // Load profile picture on component mount
  useEffect(() => {
    loadFullProfile();
  }, []);

  // Load profile picture after profile data is loaded
  useEffect(() => {
    if (profileData && !avatarUrl) {
      loadProfilePicture();
    }
  }, [profileData]);

  const loadFullProfile = async () => {
    try {
      const response = await ProfileAPI.getProfile();
      if (response.success && response.data) {
        setProfileData(response.data);
        
        // Update form data with profile information
        setFormData(prev => ({
          ...prev,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          role: getRoleName()
        }));

        // Set avatar URL if available
        if (response.data.hasAvatar && response.data.avatarUrl) {
          setAvatarUrl(ProfileUtils.getFullAvatarUrl(response.data.avatarUrl));
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Failed to load profile data');
    }
  };

  const loadProfilePicture = async () => {
    try {
      // Try to get profile picture from separate endpoint if not loaded from main profile
      if (!avatarUrl) {
        const response = await ProfileAPI.getProfilePicture();
        if (response.success) {
          const avatarUrl = ProfileUtils.getAvatarUrl(response);
          if (avatarUrl) {
            setAvatarUrl(avatarUrl);
          }
        }
      }
    } catch (error) {
      // Profile picture not found or error - that's okay
      console.log('No profile picture found or error loading avatar');
    }
  };

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Validate form data
      const profileData: ProfileUpdateDTO = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim()
      };

      const validation = ProfileUtils.validateProfileData(profileData);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      // Update profile
      const response = await ProfileAPI.updateProfile(profileData);
      
      if (response.message || response.success !== false) {
        toast.success(response.message || "Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (setting: string, value: boolean) => {
    setSecurity(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/signin');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your administrator account settings</p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="w-full sm:w-auto"
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <AvatarUpload
                    avatarUrl={avatarUrl}
                    onAvatarChange={setAvatarUrl}
                    userInitials={getInitials()}
                    size="md"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {getDisplayName()}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                    {profileData?.username && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">@{profileData.username}</p>
                    )}
                    
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={handleSave} 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Required for administrator accounts
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(value) => handleSecurityChange('twoFactor', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Session Timeout</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign out after 30 minutes of inactivity
                      </p>
                    </div>
                    <Switch
                      checked={security.sessionTimeout}
                      onCheckedChange={(value) => handleSecurityChange('sessionTimeout', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Log all administrative actions
                      </p>
                    </div>
                    <Switch
                      checked={security.auditLogging}
                      onCheckedChange={(value) => handleSecurityChange('auditLogging', value)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Status */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle>Admin Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Status</span>
                    <Badge variant="default" className={profileData?.status === 'ACTIVE' ? "bg-green-500" : "bg-red-500"}>
                      {profileData?.status || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Role</span>
                    <Badge variant="outline" className="border-purple-400 text-purple-600">
                      {formData.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Login</span>
                    <span className="text-sm text-gray-500">
                      {profileData?.lastLoginDate ? 
                        new Date(profileData.lastLoginDate).toLocaleString() : 
                        'Never'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Level</span>
                    <Badge variant="default" className={`${
                      profileData?.accountLevel === 'BRONZE' ? 'bg-orange-500' :
                      profileData?.accountLevel === 'SILVER' ? 'bg-gray-500' :
                      profileData?.accountLevel === 'GOLD' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}>
                      {profileData?.accountLevel || 'Admin'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Verified</span>
                    <Badge variant="default" className={profileData?.emailVerified ? "bg-green-500" : "bg-yellow-500"}>
                      {profileData?.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  {profileData?.registeredDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Member Since</span>
                      <span className="text-sm text-gray-500">
                        {new Date(profileData.registeredDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Admins
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  API Keys
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Logs
                </Button>
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Card className="shadow-banking border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
