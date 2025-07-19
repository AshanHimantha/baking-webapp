import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User as UserIcon, CreditCard, PiggyBank, TrendingUp, TrendingDown, ArrowRightLeft, Gift, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import apiClient from "@/lib/apiClient";


const UserAuditPage = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    apiClient.get(`/api/admin/manage/users/${username}/audit?page=${page}&size=${size}`)
      .then(res => {
        setData(res.data);
        setTotalCount(res.data.transactionsTotalCount || res.data.transactions?.length || 0);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load user audit");
        setLoading(false);
      });
  }, [username, page, size]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading user audit...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-red-500">{error || "No data found."}</div>
      </AdminLayout>
    );
  }

  const { userDetails, accounts, transactions } = data;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* User Details */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserIcon className="w-5 h-5 text-blue-600" /> User Details</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage className="object-cover" src={userDetails.profilePictureUrl ? import.meta.env.VITE_API_BASE_URL +"/api/user/profile/avatar/image/" +userDetails.profilePictureUrl : "/placeholder.svg"} />
              <AvatarFallback>{userDetails.firstName?.[0]}{userDetails.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg flex items-center gap-1">
                  {userDetails.firstName} {userDetails.lastName}
                </span>
                <Badge variant="outline">@{userDetails.username}</Badge>
                <Badge variant="outline">{userDetails.accountLevel}</Badge>
                <Badge variant="outline" className={userDetails.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {userDetails.status === 'ACTIVE' ? <CheckCircle className="inline w-4 h-4 mr-1 text-green-600" /> : <XCircle className="inline w-4 h-4 mr-1 text-red-600" />}
                  {userDetails.status}
                </Badge>
                <Badge variant="outline" className={userDetails.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : userDetails.kycStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                  {userDetails.kycStatus === 'VERIFIED' ? <CheckCircle className="inline w-4 h-4 mr-1 text-green-600" /> : userDetails.kycStatus === 'PENDING' ? <AlertTriangle className="inline w-4 h-4 mr-1 text-yellow-600" /> : <XCircle className="inline w-4 h-4 mr-1 text-red-600" />}
                  {userDetails.kycStatus}
                </Badge>
                {userDetails.emailVerified && <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle className="inline w-4 h-4 mr-1" /> Email</Badge>}
              </div>
              <div className="text-gray-600 text-sm">Email: {userDetails.email}</div>
              <div className="text-gray-600 text-sm">Phone: {userDetails.phoneNumber}</div>
              <div className="text-gray-500 text-xs mt-1">Registered: {new Date(userDetails.registeredDate).toLocaleString()}</div>
              <div className="text-gray-500 text-xs">Last Login: {userDetails.lastLoginDate ? new Date(userDetails.lastLoginDate).toLocaleString() : 'Never'}</div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-600" /> Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">Account Number</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc: any) => (
                    <tr key={acc.accountNumber} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2 flex items-center gap-2">
                        {acc.accountType === 'CURRENT' ? <CreditCard className="w-4 h-4 text-blue-500" /> : <PiggyBank className="w-4 h-4 text-green-600" />} {acc.accountNumber}
                      </td>
                      <td className="px-4 py-2">{acc.accountType}</td>
                      <td className="px-4 py-2">${Number(acc.balance).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /> Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">From</th>
                    <th className="px-4 py-2 text-left">To</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn: any) => (
                    <tr key={txn.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2">{new Date(txn.transactionDate).toLocaleString()}</td>
                      <td className="px-4 py-2 flex items-center gap-1">
                        {txn.transactionType === 'TRANSFER' ? <ArrowRightLeft className="w-4 h-4 text-blue-600" /> : txn.transactionType === 'GIFT' ? <Gift className="w-4 h-4 text-pink-500" /> : <TrendingUp className="w-4 h-4 text-green-600" />} {txn.transactionType}
                      </td>
                      <td className="px-4 py-2">${Number(txn.amount).toLocaleString()}</td>
                      <td className="px-4 py-2">{txn.fromAccountNumber || '-'}</td>
                      <td className="px-4 py-2">{txn.toAccountNumber || '-'}</td>
                      <td className="px-4 py-2">{txn.description}</td>
                      <td className="px-4 py-2 flex items-center gap-1">
                        {txn.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-green-600" /> : txn.status === 'PENDING' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> : <XCircle className="w-4 h-4 text-red-600" />} {txn.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Showing page {page} of {Math.ceil(totalCount / size) || 1}
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                  onClick={() => setPage(p => p + 1)}
                  disabled={transactions.length < size}
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserAuditPage;
