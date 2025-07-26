import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from '@/lib/apiClient'; // Ensure this path is correct
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import TransferFromAccountSelect from "@/components/customer/TransferFromAccountSelect";
interface AddCardModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void; // A function to refetch cards after a new one is created
}

export function AddCardModal({ isOpen, onOpenChange, onSuccess }: AddCardModalProps) {
  const [nickname, setNickname] = useState('');
  const [spendingLimit, setSpendingLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for accounts and the selected account
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');

  // Fetch accounts when the modal is opened
  useEffect(() => {
    if (isOpen) {
      const fetchDashboard = async () => {
        try {
          const response = await apiClient.get("/api/dashboard");
          const fetchedAccounts = response.data.accounts || [];
          setAccounts(fetchedAccounts);
          // Set the first account as the default selection
          if (fetchedAccounts.length > 0) {
            setFromAccount(fetchedAccounts[0].accountNumber);
          }
        } catch (err) {
          console.error("Failed to fetch dashboard:", err);
          toast.error("Could not fetch accounts. Please try again later.");
        }
      };
      fetchDashboard();
    }
  }, [isOpen]); // Rerun the effect when the modal's open state changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccount) {
      toast.error("Please select an account.");
      return;
    }
    setIsLoading(true);

    try {
      await apiClient.post('/api/cards/virtual', {
        fromAccountNumber: fromAccount,
        nickname,
        spendingLimit: parseFloat(spendingLimit) || 0,
      });

      toast.success("Virtual card created successfully!");
      onSuccess(); // This will trigger the card list to refresh
      onOpenChange(false); // Close the modal
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[525px] min-w-[200px] ">
        <DialogHeader>
          <DialogTitle>Add a New Virtual Card</DialogTitle>
          <DialogDescription>
            Create a new virtual card linked to one of your accounts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className=" items-center gap-4 ">
              <Label htmlFor="accountNumber" className="text-right ">
                From Account
              </Label>
              {/* The new select component for choosing an account */}
              <div className="col-span-3">
                <TransferFromAccountSelect
                  accounts={accounts}
                  selectedAccount={fromAccount}
                  onAccountChange={setFromAccount}
                />
              </div>
            </div>
            <div className="grid  items-center gap-4">
              <Label htmlFor="nickname" className="text-start">
                Nickname
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Netflix Subscription"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid  items-center gap-4">
              <Label htmlFor="limit" className="text-start">
                Spending Limit ($)
              </Label>
              <Input
                id="limit"
                type="number"
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(e.target.value)}
                placeholder="25.00"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className=' bg-orange-500 hover:bg-orange-600'>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create Card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}