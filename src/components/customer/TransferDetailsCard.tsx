// src/components/customer/TransferDetailsCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

import TransferFromAccountSelect from "./TransferFromAccountSelect";
import RecipientSearchAndDisplay from "./RecipientSearchAndDisplay";
import TransferAmountInput from "./TransferAmountInput";
import RecurringTransferOptions from "./RecurringTransferOptions";
import { Account } from "@/components/customer/RecentTransactionsList"; // Re-use the Account type

interface TransferDetailsCardProps {
  accounts: Account[];
  fromAccount: string;
  setFromAccount: (accountNumber: string) => void;
  recipient: any | null;
  setRecipient: (recipient: any | null) => void;
  amount: string;
  setAmount: (amount: string) => void;
  isRecurring: boolean;
  setIsRecurring: (checked: boolean) => void;
  frequency: string;
  setFrequency: (freq: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  message: string;
  setMessage: (msg: string) => void;
}

const TransferDetailsCard: React.FC<TransferDetailsCardProps> = ({
  accounts,
  fromAccount,
  setFromAccount,
  recipient,
  setRecipient,
  amount,
  setAmount,
  isRecurring,
  setIsRecurring,
  frequency,
  setFrequency,
  startDate,
  setStartDate,
  message,
  setMessage,
}) => {
  return (
    <Card className="shadow-banking">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Transfer Details
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 ">
        <TransferFromAccountSelect
          label="From Account"
          accounts={accounts}
          selectedAccount={fromAccount}
          onAccountChange={setFromAccount}
        />

        <RecipientSearchAndDisplay
          recipient={recipient}
          onRecipientSelected={setRecipient}
          onRecipientCleared={() => setRecipient(null)}
        />

        <div className="flex justify-between items-center space-x-2">
          <Label htmlFor="recurring-toggle" className="text-sm font-medium">
            Recurring
          </Label>
          <Switch
            id="recurring-toggle"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
          />
        </div>

        <TransferAmountInput
          amount={amount}
          onAmountChange={setAmount}
          isRecurring={isRecurring}
        />

        {isRecurring && (
          <RecurringTransferOptions
            frequency={frequency}
            onFrequencyChange={setFrequency}
            startDate={startDate}
            onStartDateChange={setStartDate}
          />
        )}

        <div className="space-y-2">
          <Label htmlFor="message" className="text-gray-600">Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a note for the recipient..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferDetailsCard;
