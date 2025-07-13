import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/userManagementApi";
import { UserUtils } from "@/lib/userManagementApi";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

interface UserStatusBadgeProps {
  user: User;
  showLoginStatus?: boolean;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ 
  user, 
  showLoginStatus = false 
}) => {
  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-3 h-3" />;
      case 'INACTIVE': return <Clock className="w-3 h-3" />;
      case 'SUSPENDED': return <XCircle className="w-3 h-3" />;
      case 'DEACTIVATED': return <AlertTriangle className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED': return 'bg-red-100 text-red-800 border-red-200';
      case 'DEACTIVATED': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <Badge 
        variant="outline" 
        className={`text-xs flex items-center space-x-1 ${getStatusColor(user.status)}`}
      >
        {getStatusIcon(user.status)}
        <span>{user.status}</span>
      </Badge>
      
      {showLoginStatus && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {UserUtils.hasLoggedIn(user) ? (
            <span className="text-green-600">
              Last login: {UserUtils.formatDate(user.lastLoginDate!)}
            </span>
          ) : (
            <span className="text-orange-600">
              Never logged in
            </span>
          )}
        </div>
      )}
    </div>
  );
};
