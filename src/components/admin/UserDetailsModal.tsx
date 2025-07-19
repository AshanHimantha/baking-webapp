import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Edit,
  Ban,
  UserCheck
} from "lucide-react";
import { User as UserType } from "@/lib/userManagementApi";
import { UserUtils } from "@/lib/userManagementApi";

interface UserDetailsModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (username: string, reason: string) => void;
  onReactivate: (username: string) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuspend,
  onReactivate
}) => {
  const [suspendReason, setSuspendReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      alert("Please provide a reason for suspension");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuspend(user.username, suspendReason);
      setSuspendReason("");
      onClose();
    } catch (error) {
      console.error("Error suspending user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivate = async () => {
    setIsSubmitting(true);
    try {
      await onReactivate(user.username);
      onClose();
    } catch (error) {
      console.error("Error reactivating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>User Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={UserUtils.getProfilePictureUrl(user) || "/placeholder.svg"} className="object-cover"/>
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {UserUtils.getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold">{UserUtils.getFullName(user)}</h2>
                    <div className={`w-3 h-3 rounded-full ${UserUtils.getStatusColor(user.status)}`}></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-white ${UserUtils.getAccountLevelColor(user.accountLevel)}`}
                    >
                      {user.accountLevel}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ID: {user.id}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                 
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* User Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{user.email}</span>
                      {user.emailVerified && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Joined: {UserUtils.getRegistrationDate(user)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        {UserUtils.hasLoggedIn(user) ? 
                          `Last login: ${UserUtils.formatDateTime(user.lastLoginDate!)}` : 
                          'Never logged in'
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Account Status:</span>
                      <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Account Level:</span>
                      <Badge 
                        variant="outline" 
                        className={`text-white ${UserUtils.getAccountLevelColor(user.accountLevel)}`}
                      >
                        {user.accountLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>KYC Status:</span>
                      <div className="flex items-center space-x-1">
                        {getKycStatusIcon(user.kycStatus)}
                        <span className="text-sm">{user.kycStatus}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>KYC Verification:</span>
                    <div className="flex items-center space-x-2">
                      {getKycStatusIcon(user.kycStatus)}
                      <span className="text-sm">{user.kycStatus}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Account Security:</span>
                    <Badge variant="outline" className="text-green-600">
                      Secure
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Auth:</span>
                    <Badge variant="outline" className="text-yellow-600">
                      Not Enabled
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.status === 'SUSPENDED' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        This account is currently suspended. You can reactivate it to restore access.
                      </p>
                      <Button 
                        onClick={handleReactivate}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? "Reactivating..." : "Reactivate Account"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="suspend-reason">Reason for Suspension:</Label>
                      <Textarea
                        id="suspend-reason"
                        placeholder="Enter the reason for suspending this account..."
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        onClick={handleSuspend}
                        disabled={isSubmitting || !suspendReason.trim()}
                        variant="destructive"
                        className="w-full"
                      >
                        {isSubmitting ? "Suspending..." : "Suspend Account"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
