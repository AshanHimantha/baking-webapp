// src/components/customer/TransferSuccessConfirmation.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

// Add Biller interface if not already defined here, or import it
interface Biller {
  billerName: string;
  category: string; // Or specific enum
  id: number;
  logoUrl: string | null;
  status: string;
}

interface TransferSuccessConfirmationProps {
  amount: string;
  isRecurring: boolean;
  frequency: string;
  startDate: string;
  transferType: 'withinBank' | 'ownAccount' | 'billPayment';
  recipient?: any | null;
  toOwnAccount?: string | null;
  biller?: Biller | null; // Use the Biller interface
  onMakeAnotherTransfer: () => void;
}

const TransferSuccessConfirmation: React.FC<TransferSuccessConfirmationProps> = ({
  amount,
  isRecurring,
  frequency,
  startDate,
  transferType,
  recipient,
  toOwnAccount,
  biller,
  onMakeAnotherTransfer,
}) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  let transferDescription = "";

  if (transferType === 'withinBank' && recipient) {
    transferDescription = `Your ${isRecurring ? 'recurring ' : ''}transfer of $${formattedAmount} to ${recipient.firstName} ${recipient.lastName} (${recipient.accountNumber}) has been completed successfully.`;
    if (isRecurring) {
      transferDescription += ` It is scheduled to start on ${startDate} and recur ${frequency}.`;
    }
  } else if (transferType === 'ownAccount' && toOwnAccount) {
    transferDescription = `Your transfer of $${formattedAmount} to your account (${toOwnAccount}) has been completed successfully.`;
  } else if (transferType === 'billPayment' && biller) {
    transferDescription = `Your ${isRecurring ? 'recurring ' : ''}payment of $${formattedAmount} to ${biller.billerName} has been completed successfully.`; // <--- CHANGE IS HERE
    if (isRecurring) {
      transferDescription += ` It is scheduled to start on ${startDate} and recur ${frequency}.`;
    }
  } else {
    transferDescription = `Your transaction of $${formattedAmount} has been completed successfully.`;
  }

  return (
    <Card className="shadow-lg max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <CheckCircleIcon className="h-6 w-6 mr-2" />
          {transferType === 'billPayment' ? 'Payment Successful!' : 'Transfer Successful!'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg text-gray-800 dark:text-gray-200">
          {transferDescription}
        </p>
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          <p>Confirmation will be sent to your email.</p>
        </div>
        <Button onClick={onMakeAnotherTransfer} className="w-full">
          Make Another {transferType === 'billPayment' ? 'Payment' : 'Transfer'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransferSuccessConfirmation;