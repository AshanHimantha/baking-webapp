// src/components/customer/TransferSummaryCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Send, User } from "lucide-react";

interface TransferSummaryCardProps {
  amount: string;
  isRecurring: boolean;
  frequency?: string;
  recipient: any | null;
  onTransfer: () => void;
  isTransferDisabled: boolean;
}

const TransferSummaryCard: React.FC<TransferSummaryCardProps> = ({
  amount,
  isRecurring,
  frequency,
  recipient,
  onTransfer,
  isTransferDisabled,
}) => {
  const getFrequencyText = (freq: string | undefined) => {
    if (!freq) return "";
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <Card className="shadow-banking">
      <CardHeader>
        <CardTitle>Transfer Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Amount</span>
            <span className="font-semibold">${amount || "0.00"}</span>
          </div>
          {isRecurring && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Frequency</span>
              <span className="font-semibold">{getFrequencyText(frequency)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Fee</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">${amount || "0.00"}</span>
          </div>
        </div>
        {recipient && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sending to:</p>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium truncate">
                {recipient.firstName} {recipient.lastName}
              </span>
            </div>
          </div>
        )}
        <Button
          onClick={onTransfer}
          disabled={isTransferDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isRecurring ? <Calendar className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          {isRecurring ? "Schedule Transfer" : "Send Money"}
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {isRecurring
            ? "Recurring transfer will start on the selected date"
            : "Transfer will be processed instantly. You can cancel within 30 seconds."}
        </p>
      </CardContent>
    </Card>
  );
};

export default TransferSummaryCard;