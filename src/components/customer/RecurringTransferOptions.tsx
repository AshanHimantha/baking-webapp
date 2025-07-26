// src/components/customer/RecurringTransferOptions.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecurringTransferOptionsProps {
  frequency: string;
  onFrequencyChange: (freq: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
}

const RecurringTransferOptions: React.FC<RecurringTransferOptionsProps> = ({
  frequency,
  onFrequencyChange,
  startDate,
  onStartDateChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="frequency" className="text-gray-600">Frequency</Label>
        <Select value={frequency} onValueChange={onFrequencyChange}>
          <SelectTrigger>
            <SelectValue />
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
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-gray-600">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]} // Ensures minimum date is today
        />
      </div>
    </div>
  );
};

export default RecurringTransferOptions;