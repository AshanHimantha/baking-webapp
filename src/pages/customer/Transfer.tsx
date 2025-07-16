// src/pages/CustomerTransfer.tsx
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Import new components
import TransferSuccessConfirmation from "@/components/customer/TransferSuccessConfirmation";
import TransferDetailsCard from "@/components/customer/TransferDetailsCard";
import TransferSummaryCard from "@/components/customer/TransferSummaryCard";
import CustomerAccountBalanceCard from "@/components/customer/CustomerAccountBalanceCard";
import TransferFromAccountSelect from "@/components/customer/TransferFromAccountSelect";
import BillPaymentForm from "@/components/customer/BillPaymentForm";

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

  // Transfer Type State
  const [transferType, setTransferType] = useState<'withinBank' | 'ownAccount' | 'billPayment'>('withinBank');

  // Form State - Common
  const [fromAccount, setFromAccount] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(""); // This state will now hold billerReferenceNumber for billPayment
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State - Specific
  const [recipient, setRecipient] = useState<any | null>(null); // For 'withinBank'
  const [toOwnAccount, setToOwnAccount] = useState<string>(""); // For 'ownAccount'
  const [biller, setBiller] = useState<any | null>(null); // For 'billPayment'


  // Fetch dashboard data (accounts for 'from account' dropdown, recent transactions)
  const fetchDashboardData = async () => {
    setIsPageLoading(true);
    try {
      const response = await apiClient.get('/api/dashboard');
      const { accounts: fetchedAccounts, recentTransactions: fetchedTransactions } = response.data;

      setAccounts(fetchedAccounts || []);
      setRecentTransactions(fetchedTransactions || []);

      if (fetchedAccounts && fetchedAccounts.length > 0 &&
          (!fromAccount || !fetchedAccounts.some(acc => acc.accountNumber === fromAccount))) {
        setFromAccount(fetchedAccounts[0].accountNumber);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Could not load your dashboard. Please try again later.");
    } finally {
      setIsPageLoading(false);
    }
  };

  // Call fetchDashboardData on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Effect to reset type-specific fields and message when transferType changes
  useEffect(() => {
    setRecipient(null);
    setToOwnAccount("");
    setBiller(null);
    setMessage(""); // Crucial: Clear message as its meaning (memo vs. billerRef) changes
    // setAmount(""); // Optionally, also clear amount
    // setIsRecurring(false); // Optionally, reset recurring
    // setFrequency("weekly");
    // setStartDate("");
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

    // Validate recurring specifics, applies only if recurring is allowed for the type
    if (isRecurring && transferType !== 'ownAccount') { // Own account transfers don't support recurring via this API
        if (!startDate) {
            toast.error("Please select a start date for the recurring transfer/payment.");
            return;
        }
        const allowedFrequencies = ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];
        const frequencyValue = frequency.toUpperCase();
        if (!allowedFrequencies.includes(frequencyValue)) {
            toast.error("Invalid frequency selected.");
            return;
        }
    }

    let successMessage = "";
    let errorMessage = "";
    let endpoint = "";
    let requestBody: any; // Use a dedicated requestBody for API call

    try {
      switch (transferType) {
        case 'withinBank':
          if (!recipient) {
            toast.error("Please select a recipient for within-bank transfer.");
            return;
          }
          if (isRecurring) {
              endpoint = "/api/payments/schedule"; // Generic schedule API
              requestBody = {
                  fromAccountNumber: fromAccount,
                  amount: parseFloat(amount),
                  userMemo: message, // 'message' is generic memo for this type
                  toAccountNumber: recipient.accountNumber,
                  frequency: frequency.toUpperCase(),
                  startDate: startDate,
                  billerId: null, // Explicitly null for non-biller transfers
                  endDate: null, // As per schedule API spec, include if not managed in UI
              };
              successMessage = `Recurring transfer to ${recipient.firstName} scheduled!`;
              errorMessage = "Failed to schedule recurring transfer";
          } else {
              endpoint = "/api/transactions/transfer"; // One-time transfer API
              requestBody = {
                  fromAccountNumber: fromAccount,
                  amount: parseFloat(amount),
                  userMemo: message, // 'message' is generic memo for this type
                  toAccountNumber: recipient.accountNumber,
              };
              successMessage = `Transfer to ${recipient.firstName} completed successfully!`;
              errorMessage = "Failed to complete transfer";
          }
          break;

        case 'ownAccount':
          if (!toOwnAccount || fromAccount === toOwnAccount) {
            toast.error("Please select a valid different destination account for own account transfer.");
            return;
          }
          if (isRecurring) {
              // As per the given API specs, recurring is not supported for own-account transfers.
              toast.error("Recurring transfers are not supported for transfers between your own accounts.");
              return;
          }
          endpoint = "/api/transactions/transfer"; // One-time transfer API
          requestBody = {
            fromAccountNumber: fromAccount,
            amount: parseFloat(amount),
            userMemo: message, // 'message' is generic memo for this type
            toAccountNumber: toOwnAccount,
          };
          successMessage = `Transfer to your other account (${toOwnAccount}) completed successfully!`;
          errorMessage = "Failed to complete own account transfer";
          // No need to reset recurring state here, as the check above prevents it if enabled.
          break;

        case 'billPayment':
          if (!biller || !biller.id) {
            toast.error("Please select a biller for bill payment.");
            return;
          }
          if (!message) { // 'message' now holds billerReferenceNumber, make it mandatory
            toast.error("Please enter the biller account number or reference.");
            return;
          }

          // For bill payment, 'message' state is now 'billerReferenceNumber'
          if (isRecurring) {
              endpoint = "/api/payments/schedule"; // Recurring bill payment API
              requestBody = {
                  fromAccountNumber: fromAccount,
                  amount: parseFloat(amount),
                  billerId: biller.id,
                  billerReferenceNumber: message, // Use 'message' state for billerReferenceNumber
                  frequency: frequency.toUpperCase(),
                  startDate: startDate,
                  toAccountNumber: null, // Required for /api/payments/schedule when using billerId
                  endDate: null, // Include as per API spec, even if not managed in UI
                  userMemo: `Recurring payment for ${biller.billerName}`, // Specific memo for schedule
              };
              successMessage = `Recurring payment to ${biller.billerName} scheduled!`;
              errorMessage = "Failed to schedule recurring bill payment";
          } else {
              endpoint = "/api/bills/pay"; // One-time bill payment API
              requestBody = {
                  fromAccountNumber: fromAccount,
                  amount: parseFloat(amount),
                  billerId: biller.id,
                  billerReferenceNumber: message, // Use 'message' state for billerReferenceNumber
                  userMemo: `One-time payment for ${biller.billerName}`, // Specific memo for one-time
              };
              successMessage = `Payment to ${biller.billerName} completed successfully!`;
              errorMessage = "Failed to complete bill payment";
          }
          break;

        default:
          toast.error("Invalid transfer type selected.");
          return;
      }

      await apiClient.post(endpoint, requestBody); // Use the constructed requestBody
      toast.success(successMessage);
      fetchDashboardData(); // Refresh account balances and recent transactions after successful transfer

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset common fields
        setAmount("");
        setMessage(""); // Clears the billerReferenceNumber or generic memo for next use
        setIsRecurring(false);
        setFrequency("weekly");
        setStartDate("");
        // Reset type-specific fields
        setRecipient(null);
        setToOwnAccount("");
        setBiller(null);
        // Refresh recurring transfers list if applicable
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
          transferType={transferType}
          recipient={transferType === 'withinBank' ? recipient : null}
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

        {/* Transfer Type Selection */}
     
<div className="flex justify-start mb-6 ">
          <ToggleGroup
            type="single"
            value={transferType}
            onValueChange={(value) => value && setTransferType(value as 'withinBank' | 'ownAccount' | 'billPayment')}
            className="bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2"
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
        <div className="grid lg:grid-cols-3 gap-6 ">
         
          
          <div className="lg:col-span-2 space-y-6 ">

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
                message={message} // 'message' is generic memo here
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
                </CardContent>
              </Card>
            )}

            {/* 3. Bill Payment (Using new component) */}
            {transferType === 'billPayment' && (
              <BillPaymentForm
                accounts={accounts}
                fromAccount={fromAccount}
                setFromAccount={setFromAccount}
                amount={amount}
                setAmount={setAmount}
                userMemo={message} // 'message' is passed as userMemo (which is billerReferenceNumber)
                setUserMemo={setMessage}
                isRecurring={isRecurring}
                setIsRecurring={setIsRecurring}
                frequency={frequency}
                setFrequency={setFrequency}
                startDate={startDate}
                setStartDate={setStartDate}
                biller={biller}
                setBiller={setBiller}
              />
            )}
          </div>
          <div className="space-y-6">
            <TransferSummaryCard
              amount={amount}
              isRecurring={isRecurring}
              frequency={frequency}
              transferType={transferType}
              recipient={transferType === 'withinBank' ? recipient : null}
              toOwnAccount={transferType === 'ownAccount' ? toOwnAccount : null}
              biller={transferType === 'billPayment' ? biller : null}
              onTransfer={handleTransfer}
              isTransferDisabled={
                !fromAccount || !amount || parseFloat(amount) <= 0 ||
                (transferType === 'withinBank' && !recipient) ||
                (transferType === 'ownAccount' && (!toOwnAccount || fromAccount === toOwnAccount)) ||
                (transferType === 'billPayment' && (!biller || !biller.id || !message)) || // Ensure message (billerReferenceNumber) is present
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