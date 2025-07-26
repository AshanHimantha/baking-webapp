
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

const TransferFromAccountSelect: React.FC<TransferFromAccountSelectProps & { label?: string }> = ({
  accounts,
  selectedAccount,
  onAccountChange,
  label
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor="fromAccount" className="text-sm  text-gray-600">
          {label}
        </Label>
      )}
      <Select value={selectedAccount} onValueChange={onAccountChange}>
        <SelectTrigger id="fromAccount">
          <SelectValue placeholder="Select an account to send from..." />
        </SelectTrigger>
        <SelectContent>
          {accounts
            .filter((account) => account.accountType === "SAVING" || account.accountType === "CURRENT")
            .map((account) => (
              <SelectItem key={account.accountNumber} value={account.accountNumber}>
                <div className="flex items-center gap-2 font-medium">
                  <span className="truncate max-w-xs">
                    {account.name} ({account.accountNumber}) - ${account.balance.toFixed(2)}
                  </span>
                  <AccountTypeBadge type={account.accountType} showText={true} />
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransferFromAccountSelect;