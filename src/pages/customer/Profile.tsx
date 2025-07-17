
import CustomerLayout from "@/components/customer/CustomerLayout";
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
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Lock, 
  LogOut,
  Edit,
  Download,
  Eye,
  Settings,
  CreditCard,
  HelpCircle,
  Loader2,
  BadgeCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { ProfileAPI, ProfileUpdateDTO, ProfileUtils, UserProfileData } from "@/lib/profileApi";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { logout, getUser, isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user data directly from auth store
  const user = getUser();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: true,
    loginAlerts: true
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

  // Show loading if not authenticated
  if (!isAuthenticated()) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </CustomerLayout>
    );
  }

  // Update form data when user changes
  useEffect(() => {
    try {
      if (user) {
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
          // address, city, state, zipCode would come from a separate profile API call
        }));
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
          address: response.data.address || '',
          // Note: city, state, zipCode are not in the current API response
          // but keeping them for potential future use
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

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
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
    navigate('/signin');
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
          </div>
          <div className="flex space-x-2">

            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
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
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      {getDisplayName()} <BadgeCheck color="#00ff40" strokeWidth={2} className="h-5 w-5  fill-green-100 ml-2" />
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{formData.email} </p>
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
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
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
            {/* <Card className="shadow-banking">
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
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(value) => handleSecurityChange('twoFactor', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Biometric Login</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    <Switch
                      checked={security.biometric}
                      onCheckedChange={(value) => handleSecurityChange('biometric', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get notified of new device logins
                      </p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(value) => handleSecurityChange('loginAlerts', value)}
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
            </Card> */}

            {/* Notification Preferences */}
            {/* <Card className="shadow-banking">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Transaction alerts and updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(value) => handleNotificationChange('email', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Important security alerts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(value) => handleNotificationChange('sms', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mobile app notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(value) => handleNotificationChange('push', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Communications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Promotional offers and news
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(value) => handleNotificationChange('marketing', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Verified</span>
                    <Badge variant="default" className={profileData?.emailVerified ? "bg-green-500" : "bg-yellow-500"}>
                      {profileData?.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Verified</span>
                    <Badge variant="default" className={profileData?.phoneNumber ? "bg-green-500" : "bg-yellow-500"}>
                      {profileData?.phoneNumber ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">KYC Status</span>
                    <Badge variant="default" className={profileData?.kycStatus === 'VERIFIED' ? "bg-green-500" : "bg-yellow-500"}>
                      {profileData?.kycStatus || 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Level</span>
                    <Badge variant="outline" className={`${
                      profileData?.accountLevel === 'BRONZE' ? 'border-orange-400 text-orange-600' :
                      profileData?.accountLevel === 'SILVER' ? 'border-gray-400 text-gray-600' :
                      profileData?.accountLevel === 'GOLD' ? 'border-yellow-400 text-yellow-600' :
                      'border-gray-400 text-gray-600'
                    }`}>
                      {profileData?.accountLevel || 'Basic'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Status</span>
                    <Badge variant="default" className={profileData?.status === 'ACTIVE' ? "bg-green-500" : "bg-red-500"}>
                      {profileData?.status || 'Unknown'}
                    </Badge>
                  </div>
                  {profileData?.registeredDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Member Since</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(profileData.registeredDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {/* <Card className="shadow-banking">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Statements
                </Button>
               

                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </Button>
              </CardContent>
            </Card> */}

          
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerProfile;
