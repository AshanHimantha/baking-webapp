// src/components/customer/BillPaymentForm.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea"; // No longer used, can be removed
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TransferFromAccountSelect from "@/components/customer/TransferFromAccountSelect";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import {
  Building2,
  HandCoins,
  GraduationCap,
  Droplet,
  Zap,
  Phone,
  Shield,
  Heart,
  CircleDot,
  Send // NEW IMPORT
} from "lucide-react";
import { Switch } from "@/components/ui/switch"; // NEW IMPORT

// Define Biller and Category types based on your API response
interface Biller {
  billerName: string;
  category: 'UTILITIES' | 'TELECOM' | 'INSURANCE' | 'FINANCE' | 'EDUCATION' | 'GOVERNMENT' | 'CHARITY' | 'WATER' | 'OTHER';
  id: number;
  logoUrl: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Account {
  accountNumber: string;
  accountName: string;
  balance: number;
  // Add other account properties if they exist
}

// Map categories to icons
const categoryIcons: { [key: string]: React.ElementType } = {
  UTILITIES: Zap,
  TELECOM: Phone,
  INSURANCE: Shield,
  FINANCE: HandCoins,
  EDUCATION: GraduationCap,
  GOVERNMENT: Building2,
  CHARITY: Heart,
  WATER: Droplet,
  OTHER: CircleDot,
};

interface BillPaymentFormProps {
  accounts: Account[];
  fromAccount: string;
  setFromAccount: (accountNumber: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  userMemo: string; // This prop now effectively represents billerReferenceNumber
  setUserMemo: (memo: string) => void;
  isRecurring: boolean;
  setIsRecurring: (isRecurring: boolean) => void;
  frequency: string;
  setFrequency: (frequency: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  biller: Biller | null;
  setBiller: (biller: Biller | null) => void;
}

const BillPaymentForm: React.FC<BillPaymentFormProps> = ({
  accounts,
  fromAccount,
  setFromAccount,
  amount,
  setAmount,
  userMemo,
  setUserMemo,
  isRecurring,
  setIsRecurring,
  frequency,
  setFrequency,
  startDate,
  setStartDate,
  biller,
  setBiller,
}) => {
  const [allBillers, setAllBillers] = useState<Biller[]>([]
  );
  const [loadingBillers, setLoadingBillers] = useState(true);
  const [errorBillers, setErrorBillers] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | undefined>(undefined);

  // Fetch billers on component mount
  useEffect(() => {
    const fetchBillers = async () => {
      setLoadingBillers(true);
      setErrorBillers(null);
      try {
        const response = await apiClient.get('/api/bills');
        
        if (response.status === 200 && Array.isArray(response.data)) {
          setAllBillers(response.data);
        } else {
          setErrorBillers("Unexpected data format from billers API.");
          toast.error("Unexpected billers data format.");
        }

      } catch (err: any) {
        console.error("Error fetching billers:", err);
        const apiErrorMessage = err?.response?.data?.message || err.message;
        setErrorBillers(apiErrorMessage || "An error occurred while fetching billers.");
        toast.error(apiErrorMessage || "Could not load billers.");
      } finally {
        setLoadingBillers(false);
      }
    };
    fetchBillers();
  }, []);

  // Group billers by category
  const billersByCategory = allBillers.reduce((acc, currentBiller) => {
    const category = currentBiller.category || 'OTHER';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(currentBiller);
    return acc;
  }, {} as Record<string, Biller[]>);

  const sortedCategories = Object.keys(billersByCategory).sort();

  if (loadingBillers) {
    return (
      <Card className="shadow-banking">
        <CardHeader><CardTitle>Bill Payment</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading billers...</p>
        </CardContent>
      </Card>
    );
  }

  if (errorBillers) {
    return (
      <Card className="shadow-banking">
        <CardHeader><CardTitle>Bill Payment</CardTitle></CardHeader>
        <CardContent>
          <p className="text-red-500">{errorBillers}</p>
          <p className="text-gray-500">Please try refreshing the page or contact support if the problem persists.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-banking">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Bill Payment Details
          </div>
          {/* Moved recurring toggle here */}
        
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Account Selection */}
        <div>
          <TransferFromAccountSelect
            label="From Account"
            accounts={accounts}
            selectedAccount={fromAccount}
            onAccountChange={setFromAccount}
          />
        </div>

        {/* Biller Selection */}
        <div>
          <Label htmlFor="biller-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Biller
          </Label>
          {biller ? (
            <div className="flex items-center justify-between p-3 border border-banking-primary rounded-md bg-banking-primary/5">
        <div className='flex items-center gap-3'>
        {biller.logoUrl && (
            <img src={import.meta.env.VITE_API_BASE_URL + biller.logoUrl} alt={biller.billerName} className="h-6 w-6 rounded-full object-contain" />
        )}
              <span className="font-medium text-banking-primary">{biller.billerName} ({biller.category})</span>
        </div>
              <Button variant="ghost" size="sm" onClick={() => setBiller(null)}>Change</Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full" value={expandedCategory} onValueChange={setExpandedCategory}>
              {sortedCategories.length === 0 ? (
                <p className="text-gray-500">No billers available.</p>
              ) : (
                sortedCategories.map((category) => {
                  const Icon = categoryIcons[category] || CircleDot;
                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="flex items-center gap-2 py-3 px-4 text-sm font-medium hover:bg-muted-foreground/10 data-[state=open]:bg-muted-foreground/10 rounded-md transition-colors">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {category} ({billersByCategory[category].length})
                      </AccordionTrigger>
                      <AccordionContent className="p-2 space-y-1">
                        {billersByCategory[category].map((billerItem) => (
                          <div
                            key={billerItem.id}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent ${
                              biller?.id === billerItem.id ? 'bg-banking-primary/10 border border-banking-primary text-banking-primary' : 'bg-muted'
                            }`}
                            onClick={() => {
                              setBiller(billerItem);
                              setExpandedCategory(undefined);
                            }}
                          >
                            {billerItem.logoUrl && (
                              <img src={import.meta.env.VITE_API_BASE_URL + billerItem.logoUrl} alt={billerItem.billerName} className="h-6 w-6 rounded-full object-contain" />
                            )}
                            <span className="font-medium">{billerItem.billerName}</span>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })
              )}
            </Accordion>
          )}
        </div>

  <div className="flex items-center justify-between space-x-2 mt-4 mb-2">
            <Label htmlFor="recurring-toggle-bill" className="text-sm font-medium">
              Recurring
            </Label>
            <Switch
                id="recurring-toggle-bill"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                disabled={!biller} // Disable if no biller is selected
            />
          </div>

        {/* Amount Input */}
        <div>
          <Label htmlFor="amountBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</Label>
          <Input
            type="number"
            id="amountBill"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className="mt-1 block w-full"
            disabled={!biller}
          />
        </div>

        {/* Removed Checkbox for Recurring Payment as it's now in CardHeader */}
        {/* <div className="flex items-center space-x-2">
          <Checkbox
            id="isRecurringBill"
            checked={isRecurring}
            onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
            disabled={!biller}
          />
          <Label htmlFor="isRecurringBill" className="text-sm font-medium text-gray-700 dark:text-gray-300">Make this a recurring payment?</Label>
        </div> */}

        {isRecurring && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequencyBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency} disabled={!biller}>
                <SelectTrigger id="frequencyBill" className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDateBill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</Label>
              <Input
                type="date"
                id="startDateBill"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full"
                disabled={!biller}
              />
            </div>
          </div>
        )}

        {/* Biller Account Number / Reference Input (userMemo) */}
        <div>
          <Label htmlFor="userMemo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biller Account Number / Reference</Label>
          <Input
            id="userMemo"
            value={userMemo}
            onChange={(e) => setUserMemo(e.target.value)}
            className="mt-1 block w-full"
            placeholder="Enter the account number or reference for this biller"
            disabled={!biller}
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default BillPaymentForm;