// src/pages/CustomerTransfer.tsx
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // NEW IMPORT

// Import the new components
import TransferSuccessConfirmation from "@/components/customer/TransferSuccessConfirmation";
import TransferDetailsCard from "@/components/customer/TransferDetailsCard";
import TransferSummaryCard from "@/components/customer/TransferSummaryCard";
import CustomerAccountBalanceCard from "@/components/customer/CustomerAccountBalanceCard";
import TransferFromAccountSelect from "@/components/customer/TransferFromAccountSelect";

// Existing Imports
import { useState, useRef, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import RecurringTransfersList, { RecurringTransfersListHandle } from "@/components/customer/RecurringTransfersList";
import RecentTransactionsList, { Account, RecentTransaction } from "@/components/customer/RecentTransactionsList";
import { Landmark, Receipt, Repeat } from "lucide-react";



const CustomerTransfer = () => {
  const recurringTransfersRef = useRef<RecurringTransfersListHandle>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);





  // Transfer Type State (NEW)
  const [transferType, setTransferType] = useState<'withinBank' | 'ownAccount' | 'billPayment'>('withinBank');

  // Form State - Common
  const [fromAccount, setFromAccount] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State - Specific (NEW)
  const [recipient, setRecipient] = useState<any | null>(null); // For 'withinBank'
  const [toOwnAccount, setToOwnAccount] = useState<string>(""); // For 'ownAccount'
  const [biller, setBiller] = useState<any | null>(null); // For 'billPayment' (e.g., { id: 'billerId123', name: 'Utility Company' })


  // Fetch dashboard data on mount (accounts for 'from account' dropdown)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/api/dashboard');
        const { accounts: fetchedAccounts, recentTransactions: fetchedTransactions } = response.data;

        setAccounts(fetchedAccounts || []);
        setRecentTransactions(fetchedTransactions || []);

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

  // Effect to reset type-specific fields when transferType changes
  useEffect(() => {
    setRecipient(null);
    setToOwnAccount("");
    setBiller(null);

  }, [transferType]);


  const selectedAccountDetails = accounts.find(
    (acc) => acc.accountNumber === fromAccount
  );

  const handleTransfer = async () => {
    // Basic common validations
    if (!fromAccount || !amount || parseFloat(amount) <= 0) {
      toast.error("Please select an account to transfer from and enter a valid amount.");
      return;
    }
    if (isRecurring && !startDate) {
      toast.error("Please select a start date for the recurring transfer/payment.");
      return;
    }

    const allowedFrequencies = ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];
    const frequencyValue = frequency.toUpperCase();
    if (isRecurring && !allowedFrequencies.includes(frequencyValue)) {
      toast.error("Invalid frequency selected.");
      return;
    }

    let successMessage = "";
    let errorMessage = "";
    let endpoint = "";
    let body: any = {
      fromAccountNumber: fromAccount,
      amount: parseFloat(amount),
      userMemo: message,
    };

    if (isRecurring) {
      body = {
        ...body,
        frequency: frequencyValue,
        startDate: startDate,
      };
    }

    try {
      switch (transferType) {
        case 'withinBank':
          if (!recipient) {
            toast.error("Please select a recipient for within-bank transfer.");
            return;
          }
          body = {
            ...body,
            toAccountNumber: recipient.accountNumber,
          };
          endpoint = isRecurring ? "/api/payments/schedule" : "/api/transactions/transfer";
          successMessage = isRecurring
            ? `Recurring transfer to ${recipient.firstName} scheduled!`
            : `Transfer to ${recipient.firstName} completed successfully!`;
          errorMessage = isRecurring
            ? "Failed to schedule recurring transfer"
            : "Failed to complete transfer";
          break;

        case 'ownAccount':
          if (!toOwnAccount || fromAccount === toOwnAccount) {
            toast.error("Please select a valid different destination account for own account transfer.");
            return;
          }
          body = {
            ...body,
            toAccountNumber: toOwnAccount,
          };
          // Assuming own account transfers are instant and not recurring via a separate API typically
          endpoint = "/api/transactions/transfer"; // Placeholder for an API endpoint for internal transfers
          successMessage = `Transfer to your other account (${toOwnAccount}) completed successfully!`;
          errorMessage = "Failed to complete own account transfer";
          // Reset recurring flags for own account transfers as they are typically not recurring
          setIsRecurring(false); // Force recurring off for own account transfers
          setFrequency("weekly");
          setStartDate("");
          break;

        case 'billPayment':
          if (!biller || !biller.id || !biller.name) {
            toast.error("Please select a biller for bill payment.");
            return;
          }
          body = {
            ...body,
            billerId: biller.id,
          };
          endpoint = isRecurring ? "/api/bills/schedule" : "/api/bills/pay"; // Placeholder for bill payment endpoints
          successMessage = isRecurring
            ? `Recurring payment to ${biller.name} scheduled!`
            : `Payment to ${biller.name} completed successfully!`;
          errorMessage = isRecurring
            ? "Failed to schedule recurring bill payment"
            : "Failed to complete bill payment";
          break;

        default:
          toast.error("Invalid transfer type selected.");
          return;
      }

      await apiClient.post(endpoint, body);
      toast.success(successMessage);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset common fields
        setAmount("");
        setMessage("");
        setIsRecurring(false);
        setFrequency("weekly");
        setStartDate("");
        // Reset type-specific fields
        setRecipient(null); // For withinBank
        setToOwnAccount(""); // For ownAccount
        setBiller(null); // For billPayment
        // Optionally, refresh lists after successful transfer
        recurringTransfersRef.current?.refreshList();
      }, 3000);

    } catch (err: any) {
      toast.error(err?.response?.data?.message || errorMessage);
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
          isRecurring={isRecurring}
          frequency={frequency}
          startDate={startDate}
          transferType={transferType} // Pass new prop
          recipient={transferType === 'withinBank' ? recipient : null} // Pass relevant data
          toOwnAccount={transferType === 'ownAccount' ? toOwnAccount : null}
          biller={transferType === 'billPayment' ? biller : null}
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

        {/* NEW: Transfer Type Selection */}
        <div className="flex justify-start mb-6">
          <ToggleGroup
            type="single"
            value={transferType}
            onValueChange={(value) => value && setTransferType(value as 'withinBank' | 'ownAccount' | 'billPayment')}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
          >
            <ToggleGroupItem value="withinBank" aria-label="Transfer within bank" className="px-4 py-2 text-sm font-medium flex items-center gap-2 data-[state=on]:bg-orange-600 data-[state=on]:text-white data-[state=on]:shadow-sm rounded-md transition-colors">
              <Landmark className="w-5" />
              Within Bank
            </ToggleGroupItem>
            <ToggleGroupItem value="ownAccount" aria-label="Transfer to own account" className="px-4 py-2 text-sm font-medium flex items-center gap-2 data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:shadow-sm rounded-md transition-colors">
             <Repeat className="w-5" />
              Own Account
            </ToggleGroupItem>
            <ToggleGroupItem value="billPayment" aria-label="Bill Payment" className="px-4 py-2 text-sm font-medium flex items-center gap-2 data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:shadow-sm rounded-md transition-colors">
              <Receipt className="w-5" />
              Bill Payment
            </ToggleGroupItem>
            
          </ToggleGroup>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">


            {/* 1. Within Bank Transfer */}
            {transferType === 'withinBank' && (
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
            )}

            {/* 2. Own Account Transfer */}
            {transferType === 'ownAccount' && (
              <Card className="shadow-banking">
                <CardHeader>
                  <CardTitle>Transfer Between Your Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                  <div></div>
                    <TransferFromAccountSelect
                      label="From Account"
                      accounts={accounts}
                      selectedAccount={fromAccount}
                      onAccountChange={setFromAccount}
                    />
                  </div>
                  <div>
                    <TransferFromAccountSelect
                      label="To Account"
                      accounts={accounts.filter(acc => acc.accountNumber !== fromAccount)}
                      selectedAccount={toOwnAccount}
                      onAccountChange={setToOwnAccount}
                    />
                  </div>
                  <div>
                    <label htmlFor="amountOwn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <input
                      type="number"
                      id="amountOwn"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="messageOwn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (Optional)</label>
                    <textarea
                      id="messageOwn"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Add a memo for this transfer..."
                    ></textarea>
                  </div>
                  {/* Recurring options typically not applicable for own account transfers */}
                </CardContent>
              </Card>
            )}

            {/* 3. Bill Payment */}
            {transferType === 'billPayment' && (
              <Card className="shadow-banking">
                <CardHeader>
                  <CardTitle>Bill Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="fromAccountBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Account</label>
                    <select
                      id="fromAccountBill"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={fromAccount}
                      onChange={(e) => setFromAccount(e.target.value)}
                    >
                      {accounts.map((account) => (
                        <option key={account.accountNumber} value={account.accountNumber}>
                          {account.accountName} ({account.accountNumber}) - ${account.balance.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="biller" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biller</label>
                    {/* In a real application, this would be a sophisticated search/lookup component for billers */}
                    {/* For this example, we'll use a simple input that sets a dummy biller object */}
                    <input
                      type="text"
                      id="biller"
                      value={biller?.name || ''}
                      onChange={(e) => setBiller({ id: `biller-${e.target.value.toLowerCase().replace(/\s/g, '-')}`, name: e.target.value })}
                      placeholder="Enter Biller Name or ID"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="amountBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <input
                      type="number"
                      id="amountBill"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  {/* Bill payments can also be recurring */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isRecurringBill"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label htmlFor="isRecurringBill" className="text-sm font-medium text-gray-700 dark:text-gray-300">Make this a recurring payment?</label>
                  </div>
                  {isRecurring && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="frequencyBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                        <select
                          id="frequencyBill"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="startDateBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <input
                          type="date"
                          id="startDateBill"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="messageBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (Optional)</label>
                    <textarea
                      id="messageBill"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Add a memo for this payment..."
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="space-y-6">
            <TransferSummaryCard
              amount={amount}
              isRecurring={isRecurring}
              frequency={frequency}
              transferType={transferType} // Pass new prop
              recipient={transferType === 'withinBank' ? recipient : null} // Pass relevant data
              toOwnAccount={transferType === 'ownAccount' ? toOwnAccount : null}
              biller={transferType === 'billPayment' ? biller : null}
              onTransfer={handleTransfer}
              isTransferDisabled={
                !fromAccount || !amount || parseFloat(amount) <= 0 ||
                (transferType === 'withinBank' && !recipient) ||
                (transferType === 'ownAccount' && (!toOwnAccount || fromAccount === toOwnAccount)) ||
                (transferType === 'billPayment' && (!biller || !biller.id)) ||
                (isRecurring && !startDate)
              }
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
            <RecentTransactionsList transactions={recentTransactions} accounts={accounts} />
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransfer;