
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import apiClient from "@/lib/apiClient";
import RecipientSearchAndDisplay from "@/components/customer/RecipientSearchAndDisplay";

const AdminDeposit = () => {
  // Recipient search state
  const [recipient, setRecipient] = useState<any | null>(null);

  // Deposit form state
  const [depositForm, setDepositForm] = useState({
    amount: "",
    notes: ""
  });
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMessage, setDepositMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear recipient and deposit form
  const handleRecipientCleared = () => {
    setRecipient(null);
    setDepositForm({ amount: "", notes: "" });
    setDepositMessage(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Deposit</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Search for a user by account number, email, or username and deposit funds.</p>

        {/* Recipient Search and Display */}
        <RecipientSearchAndDisplay
          recipient={recipient}
          onRecipientSelected={setRecipient}
          onRecipientCleared={handleRecipientCleared}
        />

        {/* Deposit Form */}
        {recipient && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDepositLoading(true);
              setDepositMessage(null);
              try {
                const res = await apiClient.post("/api/employee/deposits", {
                  toAccountNumber: recipient.accountNumber,
                  amount: parseFloat(depositForm.amount),
                  notes: depositForm.notes
                });
                setDepositMessage({ type: "success", text: res.data?.message || "Deposit successful." });
                setDepositForm({ amount: "", notes: "" });
              } catch (err: any) {
                setDepositMessage({ type: "error", text: err?.response?.data?.message || "Deposit failed." });
              } finally {
                setDepositLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">To Account Number</label>
              <input
                required
                value={recipient.accountNumber}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={depositForm.amount}
                onChange={e => setDepositForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="Enter amount"
                className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <input
                value={depositForm.notes}
                onChange={e => setDepositForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Cash deposit made at Main Branch counter."
                className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              />
            </div>
            {depositMessage && (
              <div className={`text-sm ${depositMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>{depositMessage.text}</div>
            )}
            <Button type="submit" disabled={depositLoading} className="w-full bg-green-600 hover:bg-green-700">
              {depositLoading ? "Processing..." : "Deposit"}
            </Button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDeposit;
