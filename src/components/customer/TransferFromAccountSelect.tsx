// src/components/customer/TransferFromAccountSelect.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccountTypeBadge from "@/components/common/AccountTypeBadge";
import { Account } from "@/components/customer/RecentTransactionsList"; // Re-use the Account type

interface TransferFromAccountSelectProps {
  accounts: Account[];
  selectedAccount: string;
  onAccountChange: (accountNumber: string) => void;
}

const TransferFromAccountSelect: React.FC<TransferFromAccountSelectProps> = ({
  accounts,
  selectedAccount,
  onAccountChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="fromAccount">From Account</Label>
      <Select value={selectedAccount} onValueChange={onAccountChange}>
        <SelectTrigger id="fromAccount">
          <SelectValue placeholder="Select an account to send from..." />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.accountNumber} value={account.accountNumber}>
              <div className="flex items-center gap-2 font-medium">
                <AccountTypeBadge type={account.type} showText={true} /> {/* Only show icon here */}
                <span>
                  {account.name} ({account.accountNumber}) - ${account.balance.toFixed(2)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransferFromAccountSelect;