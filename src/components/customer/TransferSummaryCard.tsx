// src/components/customer/TransferSummaryCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Add Biller interface if not already defined here, or import it
interface Biller {
  billerName: string;
  category: string; // Or specific enum
  id: number;
  logoUrl: string | null;
  status: string;
}

interface TransferSummaryCardProps {
  amount: string;
  isRecurring: boolean;
  frequency: string;
  transferType: 'withinBank' | 'ownAccount' | 'billPayment';
  recipient?: any | null;
  toOwnAccount?: string | null;
  biller?: Biller | null; // Use the Biller interface
  onTransfer: () => void;
  isTransferDisabled: boolean;
}

const TransferSummaryCard: React.FC<TransferSummaryCardProps> = ({
  amount,
  isRecurring,
  frequency,
  transferType,
  recipient,
  toOwnAccount,
  biller,
  onTransfer,
  isTransferDisabled,
}) => {
  const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

  let destinationLabel = "";
  let destinationValue = "";
  let title = "";

  if (transferType === 'withinBank') {
    title = "Transfer Summary (Within Bank)";
    destinationLabel = "Recipient:";
    destinationValue = recipient ? `${recipient.firstName} ${recipient.lastName} (${recipient.accountNumber})` : "Not selected";
  } else if (transferType === 'ownAccount') {
    title = "Transfer Summary (Own Account)";
    destinationLabel = "To Account:";
    destinationValue = toOwnAccount || "Not selected";
  } else if (transferType === 'billPayment') {
    title = "Bill Payment Summary";
    destinationLabel = "Biller:";
    destinationValue = biller?.billerName || "Not selected"; // <--- CHANGE IS HERE
  }

  return (
    <Card className="shadow-banking">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Review your transfer details before confirming.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium">Amount:</span>
          <span className="text-lg font-bold text-orange-500">${formattedAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{destinationLabel}</span>
          <span>{destinationValue}</span>
        </div>
        {isRecurring && (
          <>
            <div className="flex justify-between">
              <span className="font-medium">Frequency:</span>
              <span>{frequency}</span>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={onTransfer}
          disabled={isTransferDisabled}
          className="w-full bg-orange-500"
        >
          {isRecurring ? "Schedule Transfer" : "Confirm Transfer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransferSummaryCard;