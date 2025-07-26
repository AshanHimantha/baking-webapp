import CustomerLayout from "@/components/customer/CustomerLayout";
import TransferFromAccountSelect from "@/components/customer/TransferFromAccountSelect";
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
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { AnimatePresence, motion } from "framer-motion";

// Define the API transaction types from your enum
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

const CustomerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiTransactionTypeFilter, setApiTransactionTypeFilter] =
    useState("all");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState(null);
  // Statement modal state
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [statementAccount, setStatementAccount] = useState(null);
  const [statementStartDate, setStatementStartDate] = useState();
  const [statementEndDate, setStatementEndDate] = useState();
  // Helper to check if range is valid (<= 31 days)
  const isStatementRangeValid = statementStartDate && statementEndDate && ((statementEndDate - statementStartDate) / (1000 * 60 * 60 * 24) <= 31);
  const [statementLoading, setStatementLoading] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);


  const mapApiTransactionToUi = (transaction, currentAccount) => {
    let type, merchantName, IconComponent, colorClass, category;

    const transactionDateObj = new Date(transaction.transactionDate);
    const date = format(transactionDateObj, "yyyy-MM-dd");
    const time = format(transactionDateObj, "hh:mm a");
    const description =
      transaction.userMemo ||
      transaction.description ||
      "No description provided";

    switch (transaction.transactionType) {
      case "TRANSFER": {
        const isIncomeTransfer = transaction.toAccountNumber === currentAccount;
        type = isIncomeTransfer ? "income" : "expense";
        merchantName = isIncomeTransfer
          ? `From: ${transaction.fromAccountNumber || "Unknown Account"}`
          : `To: ${transaction.toAccountNumber || "Unknown Account"}`;
        IconComponent = isIncomeTransfer ? TrendingUp : Banknote;
        colorClass = isIncomeTransfer ? "bg-green-500" : "bg-blue-500";
        category = "Transfer";
        break;
      }
      case "BILL_PAYMENT":
        type = "expense";
        merchantName = transaction.description || "Bill Payment";
        IconComponent = Zap;
        colorClass = "bg-yellow-500";
        category = "Bills";
        break;
      case "TOP_UP":
        type = "income";
        merchantName = transaction.description || "Account Top Up";
        IconComponent = Wallet;
        colorClass = "bg-purple-500";
        category = "Top-Up";
        break;
      case "GIFT": {
        const isGiftReceived = transaction.toAccountNumber === currentAccount;
        type = isGiftReceived ? "income" : "expense";
        merchantName = isGiftReceived
          ? `Gift from: ${transaction.fromAccountNumber || "ORBIN Bank"}`
          : `Gift to: ${transaction.toAccountNumber || "Unknown Account"}`;
        IconComponent = GiftIcon;
        colorClass = isGiftReceived ? "bg-pink-500" : "bg-pink-400";
        category = "Gift";
        break;
      }
      case "FEE":
        type = "expense";
        merchantName = transaction.description || "Bank Fee";
        IconComponent = Receipt;
        colorClass = "bg-red-500";
        category = "Fee";
        break;
      case "INTEREST_PAYOUT":
        type = "income";
        merchantName = transaction.description || "Interest Payout";
        IconComponent = Percent;
        colorClass = "bg-green-600";
        category = "Interest";
        break;
      case "WITHDRAWAL":
        type = "expense";
        merchantName = transaction.description || "Cash Withdrawal";
        IconComponent = LogOut;
        colorClass = "bg-orange-500";
        category = "Cash Withdrawal";
        break;
      case "DEPOSIT":
        type = "income";
        merchantName = transaction.description || "Cash Deposit";
        IconComponent = LogIn;
        colorClass = "bg-green-700";
        category = "Cash Deposit";
        break;
      default:
        type = "expense";
        merchantName = transaction.description || "Unknown Transaction";
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
      status: transaction.status.toLowerCase(),
      icon: IconComponent,
      color: colorClass,
      description,
      originalTransactionType: transaction.transactionType,
    };
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get("/api/dashboard");
        setAccounts(response.data.accounts || []);
        if (response.data.accounts?.length > 0) {
          setFromAccount(response.data.accounts[0].accountNumber);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!fromAccount) return;

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

      const response = await apiClient.get(
        `/api/transactions/history/${fromAccount}`,
        { params }
      );
      const rawTransactions = response.data;

      const mappedTransactions = rawTransactions.map((txn) =>
        mapApiTransactionToUi(txn, fromAccount)
      );

      const filteredBySearch = mappedTransactions.filter(
        (transaction) =>
          transaction.merchant
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setTransactions(filteredBySearch);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to load transactions. Please try again.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [
    fromAccount,
    currentPage,
    pageSize,
    searchTerm,
    apiTransactionTypeFilter,
    dateRange.from,
    dateRange.to,
  ]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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

  // --- FIXED: Modal handling logic ---

  const handleOpenTransactionDetails = async (transactionId) => {
    // 1. Set loading state immediately and clear old data
    setIsModalOpen(true);
    setDetailsLoading(true);
    setTransactionDetails(null); 

    try {
      // 2. Fetch new data
      const response = await apiClient.get(`/api/transactions/${transactionId}`);
      setTransactionDetails(response.data);
    } catch (err) {
      console.error('Failed to load transaction details:', err);
      // On error, details will remain null, triggering the error message in the modal
      setTransactionDetails(null);
    } finally {
      // 3. Stop loading, whether it succeeded or failed
      setDetailsLoading(false);
    }
  };

  const handleCloseTransactionDetails = () => {
    setIsModalOpen(false);

    // 4. IMPORTANT: Reset state after the exit animation completes
    setTimeout(() => {
      setTransactionDetails(null);
      setDetailsLoading(false);
    }, 300); // Duration should match your modal's exit animation
  };

  if (!fromAccount) {
    return (
      <CustomerLayout>
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No account selected or available.
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track all your financial activities
            </p>
          </div>

          <div className="mb-4">
            <TransferFromAccountSelect
              accounts={accounts}
              selectedAccount={fromAccount}
              onAccountChange={setFromAccount}
            />
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
                    placeholder="Search merchant, description, or category..."
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
                <Button
                  variant="primary"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    setStatementAccount(fromAccount);
                    setStatementStartDate(undefined);
                    setStatementEndDate(undefined);
                    setStatementModalOpen(true);
                  }}
                >
                  Get Statement
                  <Download className="w-2 h-4 ml-2" />
                </Button>
      {/* Statement Modal */}
      <Dialog open={statementModalOpen} onOpenChange={setStatementModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Statement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TransferFromAccountSelect
              accounts={accounts}
              selectedAccount={statementAccount}
              onAccountChange={setStatementAccount}
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-1"
                  value={statementStartDate ? format(statementStartDate, 'yyyy-MM-dd') : ''}
                  onChange={e => {
                    const newStart = e.target.value ? new Date(e.target.value) : undefined;
                    // If end date is set and new start > end, reset end
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
                    // If start date is set and new end < start, reset start
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
          <DialogFooter>
            <Button
              variant="primary"
              disabled={statementLoading || !statementAccount || !statementStartDate || !statementEndDate || !isStatementRangeValid}
              onClick={async () => {
                if (!statementAccount || !statementStartDate || !statementEndDate || !isStatementRangeValid) return;
                setStatementLoading(true);
                try {
                  const start = format(statementStartDate, 'yyyy-MM-dd');
                  const end = format(statementEndDate, 'yyyy-MM-dd');
                  const response = await apiClient.get(`/api/statements/${statementAccount}/download`, {
                    params: { startDate: start, endDate: end },
                    responseType: 'blob',
                  });
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `statement-${statementAccount}-${start}-to-${end}.pdf`);
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
              }}
            >
              {statementLoading ? 'Downloading...' : 'Download PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Loading transactions...
                </p>
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
                      className="flex items-center justify-between p-3 px-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {transaction.merchant}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs gap-1 py-0.5">
                              {transaction.category}
                              <div className={`${transaction.color} p-1 rounded-full text-white`}>
                                <Icon className="w-2 h-2" />
                              </div>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p
                            className={`font-semibold text-lg ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs min-w-20">
                            {transaction.date}
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

            {/* Modal is now controlled by the fixed logic */}
            <TransactionDetailModal
              isOpen={isModalOpen}
              onClose={handleCloseTransactionDetails}
              details={transactionDetails}
              isLoading={detailsLoading}
            />

            {!loading && !error && transactions.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No transactions found
                </p>
                <p className="text-sm text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransactions;