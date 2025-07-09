
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  LogOut,
  Settings,
  Users,
  Key
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@bank.com',
    phone: '+1 (555) 999-0000',
    role: 'Super Administrator'
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: true,
    auditLogging: true
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
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
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-600 text-white text-xl">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formData.firstName} {formData.lastName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                    <Badge variant="default" className="mt-1 bg-purple-600">
                      {formData.role}
                    </Badge>
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Role</span>
                    <Badge variant="outline">Super Admin</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Login</span>
                    <span className="text-sm text-gray-500">Today 09:15 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Access Level</span>
                    <Badge variant="default" className="bg-purple-500">Full Access</Badge>
                  </div>
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
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900">
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
