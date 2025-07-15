// src/components/customer/TransferSuccessConfirmation.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface TransferSuccessConfirmationProps {
  amount: string;
  recipient: { firstName: string; lastName: string };
  isRecurring: boolean;
  frequency?: string;
  startDate?: string;
  onMakeAnotherTransfer: () => void;
}

const TransferSuccessConfirmation: React.FC<TransferSuccessConfirmationProps> = ({
  amount,
  recipient,
  isRecurring,
  frequency,
  startDate,
  onMakeAnotherTransfer,
}) => {
  const getFrequencyText = (freq: string | undefined) => {
    if (!freq) return "";
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-banking-lg animate-bounce-in">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-success">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {isRecurring ? "Recurring Transfer Set Up!" : "Transfer Successful!"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isRecurring
              ? `$${amount} will be sent ${getFrequencyText(frequency).toLowerCase()} to ${recipient?.firstName} ${recipient?.lastName} starting ${startDate}`
              : `$${amount} has been sent to ${recipient?.firstName} ${recipient?.lastName}`}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRecurring ? "Schedule ID" : "Transaction ID"}
            </p>
            <p className="font-mono text-sm text-gray-900 dark:text-white">
              {isRecurring ? "SCH" : "TXN"}-{Date.now()}
            </p>
          </div>
          <Button onClick={onMakeAnotherTransfer} className="w-full">
            {isRecurring ? "Set Up Another" : "Make Another Transfer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferSuccessConfirmation;