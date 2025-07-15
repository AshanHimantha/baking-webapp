// src/pages/CustomerTransfer.tsx (or wherever it lives, e.g., src/app/customer/transfer/page.tsx)
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Still needed for Recent Transfers card

// Import the new components
import TransferSuccessConfirmation from "@/components/customer/TransferSuccessConfirmation";
import TransferDetailsCard from "@/components/customer/TransferDetailsCard";
import TransferSummaryCard from "@/components/customer/TransferSummaryCard";
import CustomerAccountBalanceCard from "@/components/customer/CustomerAccountBalanceCard";

// Existing Imports
import { useState, useRef, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import RecurringTransfersList, { RecurringTransfersListHandle } from "@/components/customer/RecurringTransfersList";
import RecentTransactionsList, { Account, RecentTransaction } from "@/components/customer/RecentTransactionsList";


const CustomerTransfer = () => {
  const recurringTransfersRef = useRef<RecurringTransfersListHandle>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]); // Still kept for RecentTransactionsList
  const [isPageLoading, setIsPageLoading] = useState(true); // Still kept for page loading state

  // Form State
  const [fromAccount, setFromAccount] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch dashboard data on mount (accounts for 'from account' dropdown)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/api/dashboard');
        const { accounts: fetchedAccounts, recentTransactions: fetchedTransactions } = response.data;

        setAccounts(fetchedAccounts || []);
        setRecentTransactions(fetchedTransactions || []); // Still used if RecentTransactionsList is populated by parent

        if (fetchedAccounts && fetchedAccounts.length > 0) {
          setFromAccount(fetchedAccounts[0].accountNumber);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Could not load your dashboard. Please try again later.");
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const selectedAccountDetails = accounts.find(
    (acc) => acc.accountNumber === fromAccount
  );

  const handleTransfer = async () => {
    if (!fromAccount || !amount || !recipient) {
      toast.error(
        "Please select an account to transfer from, a recipient, and enter an amount."
      );
      return;
    }

    if (isRecurring && !startDate) {
      toast.error("Please select a start date for the recurring transfer.");
      return;
    }

    const allowedFrequencies = [
      "DAILY",
      "WEEKLY",
      "MONTHLY",
      "QUARTERLY",
      "YEARLY",
    ];
    const frequencyValue = frequency.toUpperCase();
    if (isRecurring && !allowedFrequencies.includes(frequencyValue)) {
      toast.error("Invalid frequency selected.");
      return;
    }

    try {
      if (isRecurring) {
        const body = {
          fromAccountNumber: fromAccount,
          toAccountNumber: recipient.accountNumber,
          amount: parseFloat(amount),
          frequency: frequencyValue,
          startDate: startDate,
          userMemo: message,
        };
        await apiClient.post("/api/payments/schedule", body);
        toast.success(
          `Recurring transfer to ${recipient.firstName} scheduled! Will start on ${startDate}`
        );
      } else {
        const body = {
          fromAccountNumber: fromAccount,
          toAccountNumber: recipient.accountNumber,
          amount: parseFloat(amount),
          userMemo: message,
        };
        await apiClient.post("/api/transactions/transfer", body);
        toast.success(
          `Transfer to ${recipient.firstName} completed successfully!`
        );
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAmount("");
        setRecipient(null);
        setMessage("");
        setIsRecurring(false);
        setFrequency("weekly");
        setStartDate("");
        // Optionally, refresh lists after successful transfer
        recurringTransfersRef.current?.refreshList();
        // You might want to refresh recent transactions as well, if RecentTransactionsList
        // has a refresh method or is driven by state in this component.
      }, 3000);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (isRecurring
            ? "Failed to schedule recurring transfer"
            : "Failed to complete transfer")
      );
    }
  };

  // If page is loading, you might show a spinner or skeleton
  if (isPageLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </CustomerLayout>
    );
  }

  // Conditional render for success message
  if (showSuccess) {
    return (
      <CustomerLayout>
        <TransferSuccessConfirmation
          amount={amount}
          recipient={recipient}
          isRecurring={isRecurring}
          frequency={frequency}
          startDate={startDate}
          onMakeAnotherTransfer={() => setShowSuccess(false)}
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Send Money
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transfer money to friends, family, or pay bills
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TransferDetailsCard
              accounts={accounts}
              fromAccount={fromAccount}
              setFromAccount={setFromAccount}
              recipient={recipient}
              setRecipient={setRecipient}
              amount={amount}
              setAmount={setAmount}
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              frequency={frequency}
              setFrequency={setFrequency}
              startDate={startDate}
              setStartDate={setStartDate}
              message={message}
              setMessage={setMessage}
            />
          </div>
          <div className="space-y-6">
            <TransferSummaryCard
              amount={amount}
              isRecurring={isRecurring}
              frequency={frequency}
              recipient={recipient}
              onTransfer={handleTransfer}
              isTransferDisabled={!fromAccount || !amount || !recipient || (isRecurring && !startDate)}
            />
            <CustomerAccountBalanceCard
              selectedAccountDetails={selectedAccountDetails}
            />
          </div>
        </div>

        {/* Existing Lists */}
        <RecurringTransfersList ref={recurringTransfersRef} />
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            {/* RecentTransactionsList would likely be populated here or be its own component receiving `recentTransactions` */}
            <RecentTransactionsList transactions={recentTransactions} accounts={accounts} />
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransfer;