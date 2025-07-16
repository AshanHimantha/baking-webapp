import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TransferSummaryCardProps {
  amount: string;
  isRecurring: boolean;
  frequency: string;
  // NEW PROPS FOR TRANSFER TYPES
  transferType: 'withinBank' | 'ownAccount' | 'billPayment';
  recipient?: any | null; // Optional for withinBank
  toOwnAccount?: string | null; // Optional for ownAccount
  biller?: { id: string; name: string } | null; // Optional for billPayment
  // END NEW PROPS
  onTransfer: () => void;
  isTransferDisabled: boolean;
}

const TransferSummaryCard: React.FC<TransferSummaryCardProps> = ({
  amount,
  isRecurring,
  frequency,
  transferType, // Destructure new prop
  recipient, // Destructure new prop
  toOwnAccount, // Destructure new prop
  biller, // Destructure new prop
  onTransfer,
  isTransferDisabled,
}) => {
  const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

  let destinationLabel = "";
  let destinationValue = "";
  let title = "";

  // Determine display based on transferType
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
    destinationValue = biller?.name || "Not selected";
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
          <span className="text-lg font-bold text-blue-600">${formattedAmount}</span>
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
        {/* Add more summary details if needed, e.g., message */}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={onTransfer}
          disabled={isTransferDisabled}
          className="w-full"
        >
          {isRecurring ? "Schedule Transfer" : "Confirm Transfer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransferSummaryCard;