// src/components/customer/TransferAmountInput.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface TransferAmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  isRecurring: boolean;
}

const TransferAmountInput: React.FC<TransferAmountInputProps> = ({
  amount,
  onAmountChange,
  isRecurring,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-gray-600">Amount</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="pl-10 text-lg font-semibold"
          />
        </div>
      </div>
      {!isRecurring && (
        <div className="space-y-2">
          <Label>Quick Amount</Label>
          <div className="grid grid-cols-4 gap-2">
            {["10", "25", "50", "100"].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => onAmountChange(quickAmount)}
              >
                ${quickAmount}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TransferAmountInput;