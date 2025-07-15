// src/components/customer/RecentTransactionsList.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, ArrowDownLeft, Receipt, Send, Banknote } from "lucide-react";

// Interfaces for type safety
// It's often good practice to define these in a shared types file (e.g., src/types/index.ts)
// if they are used across multiple components. For this example, keeping them here.
export interface Account {
  accountNumber: string;
  accountType: string;
  balance: number;
  id: number;
  ownerName: string;
}

export interface RecentTransaction {
  id: number;
  transactionDate: string;
  transactionType: "TRANSFER" | "BILL_PAYMENT" | "DEPOSIT" | "WITHDRAWAL";
  status: string;
  amount: number;
  fromAccountNumber: string;
  toAccountNumber: string;
  description: string;
  userMemo: string;
}

interface RecentTransactionsListProps {
  transactions?: RecentTransaction[]; // Made optional, with default value in component
  accounts?: Account[];             // Corrected name and made optional
}

// Helper to format date nicely
const formatTransactionDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Invalid date string:", dateString, error);
    return dateString; // Return original if parsing fails
  }
};

// Helper to get an icon based on transaction type
const getTransactionTypeIcon = (type: string) => {
    switch (type) {
        case "TRANSFER":
            return <Send className="w-5 h-5 text-gray-500" />;
        case "BILL_PAYMENT":
            return <Receipt className="w-5 h-5 text-gray-500" />;
        case "DEPOSIT":
        case "WITHDRAWAL":
            return <Banknote className="w-5 h-5 text-gray-500" />;
        default:
            return <Banknote className="w-5 h-5 text-gray-500" />; // Fallback
    }
}

const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions = [], // Provide default empty array to prevent .map() on undefined
  accounts = [],     // Provide default empty array and use the correct prop name
}) => {
  // Ensure accounts is an array before calling map
  const userAccountNumbers = accounts.map(acc => acc.accountNumber);

  return (
    <Card className="shadow-banking">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => {
              // Determine if the transaction is outgoing from one of the user's accounts
              const isOutgoing = userAccountNumbers.includes(tx.fromAccountNumber);
              
              // You might want to display who the transaction is with
              // This requires more data from your API (e.g., recipient name for transfers)
              // For now, using description or a generic placeholder
              const transactionPartner = tx.description || (isOutgoing ? tx.toAccountNumber : tx.fromAccountNumber);

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 bg-gray-100 dark:bg-gray-800 border">
                        {getTransactionTypeIcon(tx.transactionType)}
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transactionPartner}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTransactionDate(tx.transactionDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isOutgoing ? 'text-gray-900 dark:text-white' : 'text-green-600'}`}>
                      {isOutgoing ? "-" : "+"} ${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 capitalize flex items-center justify-end gap-1">
                      {isOutgoing ? 
                        <ArrowUpRight className="w-3 h-3 text-red-500" /> : 
                        <ArrowDownLeft className="w-3 h-3 text-green-500" />
                      }
                      {tx.status.toLowerCase()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No recent transactions to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

RecentTransactionsList.displayName = "RecentTransactionsList";

export default RecentTransactionsList;