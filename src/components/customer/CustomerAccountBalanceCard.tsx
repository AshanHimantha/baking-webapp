
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Account } from "@/components/customer/RecentTransactionsList"; // Re-use the Account type

interface CustomerAccountBalanceCardProps {
  selectedAccountDetails: Account | null;
}

const CustomerAccountBalanceCard: React.FC<CustomerAccountBalanceCardProps> = ({
  selectedAccountDetails,
}) => {
  return (
    <Card className="shadow-banking">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Account Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${selectedAccountDetails ? selectedAccountDetails.balance.toFixed(2) : "0.00"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedAccountDetails ? `${selectedAccountDetails.name} Balance` : "Available Balance"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerAccountBalanceCard;