
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  CreditCard,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

const AdminApprovals = () => {
  const pendingApprovals = [
    {
      id: "APP-001",
      type: "account_opening",
      title: "Account Opening",
      customer: "Robert Brown",
      email: "robert.brown@email.com",
      submitted: "2024-01-09",
      priority: "high",
      details: "New premium checking account application",
      amount: null
    },
    {
      id: "APP-002",
      type: "credit_limit",
      title: "Credit Limit Increase",
      customer: "Lisa Taylor",
      email: "lisa.taylor@email.com",
      submitted: "2024-01-08",
      priority: "medium",
      details: "Requesting credit limit increase from $5,000 to $15,000",
      amount: 15000
    },
    {
      id: "APP-003",
      type: "large_transaction",
      title: "Large Transaction",
      customer: "David Wilson",
      email: "david.wilson@email.com",
      submitted: "2024-01-08",
      priority: "high",
      details: "Wire transfer of $50,000 to international account",
      amount: 50000
    },
    {
      id: "APP-004",
      type: "account_closure",
      title: "Account Closure",
      customer: "Maria Garcia",
      email: "maria.garcia@email.com",
      submitted: "2024-01-07",
      priority: "low",
      details: "Request to close savings account with balance transfer",
      amount: 2500
    }
  ];

  const handleApproval = (id: string, action: 'approve' | 'reject') => {
    toast.success(`Request ${action}d successfully!`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'account_opening': return <User className="w-5 h-5" />;
      case 'credit_limit': return <CreditCard className="w-5 h-5" />;
      case 'large_transaction': return <DollarSign className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'account_opening': return 'bg-blue-100 dark:bg-blue-900 text-blue-600';
      case 'credit_limit': return 'bg-purple-100 dark:bg-purple-900 text-purple-600';
      case 'large_transaction': return 'bg-green-100 dark:bg-green-900 text-green-600';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Approvals</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve pending account requests</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Clock className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-red-600">
                {pendingApprovals.filter(a => a.priority === 'high').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-600">156</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved Today</p>
            </CardContent>
          </Card>
          <Card className="shadow-banking">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-gray-600">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${getTypeColor(approval.type)}`}>
                        {getTypeIcon(approval.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {approval.title}
                          </h3>
                          <Badge 
                            variant={
                              approval.priority === 'high' ? 'destructive' :
                              approval.priority === 'medium' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {approval.priority} priority
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{approval.details}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>ID: {approval.id}</span>
                          <span>Submitted: {approval.submitted}</span>
                          {approval.amount && (
                            <span className="font-medium">Amount: ${approval.amount.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {approval.customer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{approval.customer}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{approval.email}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproval(approval.id, 'reject')}
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproval(approval.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pendingApprovals.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No pending approvals</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">All requests have been reviewed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApprovals;
