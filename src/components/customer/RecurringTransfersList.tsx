// src/components/customer/RecurringTransfersList.tsx

import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Pause, Play, Trash2, Loader2, FileWarning } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

// Interface for type safety on the API response
interface ScheduledPayment {
  id: number;
  fromAccountNumber: string;
  toAccountNumber: string;
  toRecipientName: string;
  amount: number;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  nextExecutionDate: string;
  status: "ACTIVE" | "PAUSED" | "INACTIVE";
  userMemo: string;
}

// Define the type for the handle that will be exposed via the ref
export interface RecurringTransfersListHandle {
  refresh: () => void;
}

const getFrequencyText = (freq: string) => {
    if (!freq) return "";
    return freq.charAt(0).toUpperCase() + freq.slice(1).toLowerCase();
};
  
const getStatusText = (status: string) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const RecurringTransfersList = forwardRef<RecurringTransfersListHandle>((props, ref) => {
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScheduledPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<ScheduledPayment[]>("/api/payments/schedule");
      setScheduledPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch recurring payments", error);
      toast.error("Could not load your recurring payments.");
      setScheduledPayments([]); // Clear out old data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Expose the fetch function to the parent component via the ref
  useImperativeHandle(ref, () => ({
    refresh() {
      fetchScheduledPayments();
    },
  }));

  // Fetch data on component mount
  useEffect(() => {
    fetchScheduledPayments();
  }, [fetchScheduledPayments]);

  const handleToggleStatus = async (payment: ScheduledPayment) => {
    const isPausing = payment.status === 'ACTIVE';
    const action = isPausing ? 'pause' : 'resume';
    const toastId = toast.loading(`${isPausing ? 'Pausing' : 'Resuming'} transfer...`);

    try {
        // Assuming the API endpoint is like /api/payments/schedule/{id}/pause or /resume
        await apiClient.post(`/api/payments/schedule/${payment.id}/${action}`);
        toast.success(`Transfer successfully ${isPausing ? 'paused' : 'resumed'}.`, { id: toastId });
        fetchScheduledPayments(); // Refresh the list
    } catch (err: any) {
        toast.error(err?.response?.data?.message || `Failed to ${action} transfer.`, { id: toastId });
    }
  };

  const handleDeleteSchedule = async (paymentId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this recurring transfer?")) {
        return;
    }
    const toastId = toast.loading("Deleting transfer...");

    try {
        await apiClient.delete(`/api/payments/schedule/${paymentId}`);
        toast.success("Recurring transfer deleted.", { id: toastId });
        fetchScheduledPayments(); // Refresh the list
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to delete transfer.', { id: toastId });
    }
  };

  return (
    <Card className="shadow-banking">
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="w-5 h-5 mr-2" />
          Active Recurring Transfers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="ml-4 text-gray-600 dark:text-gray-400">Loading schedules...</p>
          </div>
        ) : scheduledPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No recurring transfers found.</p>
            <p className="text-sm">Set one up using the form above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {payment.toRecipientName?.split(" ").map((n) => n[0]).join("") || '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {payment.toRecipientName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {payment.toAccountNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${payment.amount.toFixed(2)} • {getFrequencyText(payment.frequency)} • Next: {payment.nextExecutionDate}
                    </p>
                    {payment.userMemo?.startsWith("Last attempt on") && (
                       <p className="text-xs text-red-500 mt-1 truncate" title={payment.userMemo}>
                         <FileWarning className="w-3 h-3 inline-block mr-1 flex-shrink-0"/> 
                         {payment.userMemo}
                       </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2 ml-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      payment.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {getStatusText(payment.status)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStatus(payment)}
                    title={payment.status === "ACTIVE" ? "Pause" : "Resume"}
                  >
                    {payment.status === "ACTIVE" ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSchedule(payment.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default RecurringTransfersList;