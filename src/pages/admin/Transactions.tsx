
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TransactionDetailModal from "@/components/customer/TransactionDetailModal";
import {
  Search,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  Banknote,
  Zap,
  Wallet,
  Receipt,
  Percent,
  LogIn,
  LogOut,
  HelpCircle,
  MoreVertical,
  Gift as GiftIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import { useState, useEffect, useCallback } from "react";


// Transaction types for admin filter
const APITransactionTypes = [
  { value: "all", label: "All Types" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "BILL_PAYMENT", label: "Bill Payment" },
  { value: "TOP_UP", label: "Top Up" },
  { value: "GIFT", label: "Gift" },
  { value: "FEE", label: "Fee" },
  { value: "INTEREST_PAYOUT", label: "Interest Payout" },
  { value: "WITHDRAWAL", label: "Withdrawal" },
  { value: "DEPOSIT", label: "Deposit" },
];

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiTransactionTypeFilter, setApiTransactionTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Statement modal state
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [statementStartDate, setStatementStartDate] = useState();
  const [statementEndDate, setStatementEndDate] = useState();
  const isStatementRangeValid = statementStartDate && statementEndDate && ((statementEndDate - statementStartDate) / (1000 * 60 * 60 * 24) <= 31);
  const [statementLoading, setStatementLoading] = useState(false);

  // Map API transaction to UI
  const mapApiTransactionToUi = (transaction) => {
    let type, merchantName, IconComponent, colorClass, category;
    const transactionDateObj = new Date(transaction.transactionDate);
    const date = format(transactionDateObj, "yyyy-MM-dd");
    const time = format(transactionDateObj, "hh:mm a");
    const description = transaction.userMemo || transaction.description || "No description provided";
    // Try to extract customer name from all possible fields
    merchantName =
      transaction.fromOwnerUsername ||
      transaction.toOwnerUsername ||
      transaction.customerName ||
      transaction.customer ||
      transaction.userName ||
      transaction.user ||
      transaction.accountHolder ||
      transaction.accountHolderName ||
      transaction.ownerName ||
      transaction.owner ||
      "Unknown Customer";
    switch (transaction.transactionType) {
      case "TRANSFER":
        type = "expense";
        IconComponent = Banknote;
        colorClass = "bg-blue-500";
        category = "Transfer";
        break;
      case "BILL_PAYMENT":
        type = "expense";
        IconComponent = Zap;
        colorClass = "bg-yellow-500";
        category = "Bills";
        break;
      case "TOP_UP":
        type = "income";
        IconComponent = Wallet;
        colorClass = "bg-purple-500";
        category = "Top-Up";
        break;
      case "GIFT":
        type = "income";
        IconComponent = GiftIcon;
        colorClass = "bg-pink-500";
        category = "Gift";
        break;
      case "FEE":
        type = "expense";
        IconComponent = Receipt;
        colorClass = "bg-red-500";
        category = "Fee";
        break;
      case "INTEREST_PAYOUT":
        type = "income";
        IconComponent = Percent;
        colorClass = "bg-green-600";
        category = "Interest";
        break;
      case "WITHDRAWAL":
        type = "expense";
        IconComponent = LogOut;
        colorClass = "bg-orange-500";
        category = "Cash Withdrawal";
        break;
      case "DEPOSIT":
        type = "income";
        IconComponent = LogIn;
        colorClass = "bg-green-700";
        category = "Cash Deposit";
        break;
      default:
        type = "expense";
        IconComponent = HelpCircle;
        colorClass = "bg-gray-400";
        category = "Other";
        break;
    }
    return {
      id: transaction.id,
      type,
      merchant: merchantName,
      amount: parseFloat(transaction.amount),
      date,
      time,
      category,
      status: transaction.status ? transaction.status.toLowerCase() : "unknown",
      icon: IconComponent,
      color: colorClass,
      description,
      originalTransactionType: transaction.transactionType,
      flag: transaction.flag,
      fee: transaction.fee || 0,
    };
  };

  // Fetch all transactions (admin: all users)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        size: pageSize,
        page: currentPage,
      };
      if (apiTransactionTypeFilter !== "all") {
        params.type = apiTransactionTypeFilter;
      }
      if (dateRange.from) {
        params.startDate = format(dateRange.from, "yyyy-MM-dd");
      }
      if (dateRange.to) {
        params.endDate = format(dateRange.to, "yyyy-MM-dd");
      }
      const response = await apiClient.get(`/api/admin/transactions`, { params });
      console.log("/api/admin/transactions response:", response);
      let rawTransactions = response.data;
      // Support both array and object (with data property) responses
      if (!Array.isArray(rawTransactions) && Array.isArray(rawTransactions.data)) {
        rawTransactions = rawTransactions.data;
      }
      if (!Array.isArray(rawTransactions)) {
        throw new Error("API did not return an array of transactions");
      }
      const mappedTransactions = rawTransactions.map(mapApiTransactionToUi);
      const filteredBySearch = mappedTransactions.filter(
        (transaction) =>
          transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(transaction.id).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTransactions(filteredBySearch);
    } catch (err) {
      console.error("Transaction fetch error:", err, err?.response);
      setError("Failed to load transactions. Please try again.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, apiTransactionTypeFilter, dateRange.from, dateRange.to]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Download statement (all users, filtered)
  const handleDownloadStatement = async () => {
    if (!statementStartDate || !statementEndDate || !isStatementRangeValid) return;
    setStatementLoading(true);
    try {
      const start = format(statementStartDate, 'yyyy-MM-dd');
      const end = format(statementEndDate, 'yyyy-MM-dd');
      const response = await apiClient.get(`/api/admin/statements/download`, {
        params: { startDate: start, endDate: end },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin-statement-${start}-to-${end}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setStatementModalOpen(false);
    } catch (err) {
      alert('Failed to download statement.');
    } finally {
      setStatementLoading(false);
    }
  };

  // Download receipt for a transaction
  const handleDownloadReceipt = async (transactionId) => {
    try {
      const response = await apiClient.get(`/api/transactions/${transactionId}/receipt`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download receipt.');
    }
  };

  // Modal logic
  const handleOpenTransactionDetails = async (transactionId) => {
    setIsModalOpen(true);
    setDetailsLoading(true);
    setTransactionDetails(null);
    try {
      const response = await apiClient.get(`/api/transactions/${transactionId}`);
      setTransactionDetails(response.data);
    } catch (err) {
      setTransactionDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };
  const handleCloseTransactionDetails = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setTransactionDetails(null);
      setDetailsLoading(false);
    }, 300);
  };


  return (
    <AdminLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Monitor</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor all banking transactions and detect fraud</p>
          </div>
         
        </div>

        {/* Filters */}
        <Card className="shadow-banking">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by customer, transaction ID, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={apiTransactionTypeFilter}
                  onValueChange={setApiTransactionTypeFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {APITransactionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full sm:w-auto justify-start text-left font-normal ${
                        !dateRange.from && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Date Range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statement Modal */}
        <Popover open={statementModalOpen} onOpenChange={setStatementModalOpen}>
          <PopoverContent className="w-[350px]">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={statementStartDate ? format(statementStartDate, 'yyyy-MM-dd') : ''}
                    onChange={e => {
                      const newStart = e.target.value ? new Date(e.target.value) : undefined;
                      if (statementEndDate && newStart && newStart > statementEndDate) {
                        setStatementEndDate(undefined);
                      }
                      setStatementStartDate(newStart);
                    }}
                    max={statementEndDate ? format(statementEndDate, 'yyyy-MM-dd') : undefined}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={statementEndDate ? format(statementEndDate, 'yyyy-MM-dd') : ''}
                    onChange={e => {
                      const newEnd = e.target.value ? new Date(e.target.value) : undefined;
                      if (statementStartDate && newEnd && newEnd < statementStartDate) {
                        setStatementStartDate(undefined);
                      }
                      setStatementEndDate(newEnd);
                    }}
                    min={statementStartDate ? format(statementStartDate, 'yyyy-MM-dd') : undefined}
                    max={statementStartDate ? format(new Date(+statementStartDate + 31 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') : undefined}
                  />
                </div>
              </div>
              {statementStartDate && statementEndDate && !isStatementRangeValid && (
                <div className="text-xs text-red-500 mt-2">Maximum range is 31 days.</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="primary"
                disabled={statementLoading || !statementStartDate || !statementEndDate || !isStatementRangeValid}
                onClick={handleDownloadStatement}
              >
                {statementLoading ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Transactions List */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Loading transactions...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mt-4"></div>
              </div>
            )}
            {error && (
              <div className="text-center py-12 text-red-500">
                <p className="text-lg font-medium">Error loading data</p>
                <p>{error}</p>
              </div>
            )}
            {!loading && !error && (
              <div className="space-y-2 ">
                {transactions.map((transaction) => {
                  const Icon = transaction.icon;
                  return (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-3 px-3 rounded-lg border transition-colors ${
                        transaction.flag
                          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {transaction.merchant}
                            </p>
                            {transaction.flag && (
                              <Badge variant="destructive" className="text-xs">
                                {transaction.flag}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs gap-1 py-0.5">
                              {transaction.category}
                              <div className={`${transaction.color} p-1 rounded-full text-white`}>
                                <Icon className="w-2 h-2" />
                              </div>
                            </Badge>
                            <Badge 
                              variant={
                                transaction.status === 'completed' ? 'default' :
                                transaction.status === 'pending' ? 'secondary' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className={`font-semibold text-lg ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs min-w-20">
                            {transaction.date}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Fee: ${transaction.fee.toFixed(2)}
                          </p>
                        </div>
                        {transaction.originalTransactionType !== 'GIFT' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                                <MoreVertical className="w-5 h-5 text-gray-500" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownloadReceipt(transaction.id)}>
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenTransactionDetails(transaction.id)}>
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal for transaction details */}
            <TransactionDetailModal
              isOpen={isModalOpen}
              onClose={handleCloseTransactionDetails}
              details={transactionDetails}
              isLoading={detailsLoading}
            />

            {!loading && !error && transactions.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
