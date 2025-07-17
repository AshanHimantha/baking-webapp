import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Re-using the card interface
interface IVirtualCard {
  id: number;
  nickname: string;
  spendingLimit: number;
  // ... other properties
}

interface CardSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void; // To refetch cards on success
  card: IVirtualCard | null; // The card we are editing
}

export function CardSettingsModal({ isOpen, onOpenChange, onSuccess, card }: CardSettingsModalProps) {
  const [newLimit, setNewLimit] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  
  const [isLimitLoading, setIsLimitLoading] = useState(false);
  const [isPinLoading, setIsPinLoading] = useState(false);

  // Set initial state when the modal opens with a card
  useState(() => {
    if (card) {
      setNewLimit(card.spendingLimit.toString());
    }
  });

  if (!card) return null; // Don't render the modal if no card is selected

  const handleLimitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLimitLoading(true);
    try {
      await apiClient.put(`/api/cards/virtual/${card.id}/limit`, {
        newLimit: parseFloat(newLimit)
      });
      toast.success("Spending limit updated successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update limit.");
      console.error("Update limit error:", error);
    } finally {
      setIsLimitLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPinLoading(true);
    try {
      await apiClient.post(`/api/cards/virtual/${card.id}/pin`, {
        currentPassword,
        newPin
      });
      toast.success("Card PIN set/updated successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to set PIN. Check your password.");
      console.error("Set PIN error:", error);
    } finally {
      setIsPinLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Card Settings: {card.nickname}</DialogTitle>
          <DialogDescription>
            Manage settings for your virtual card.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="limit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="limit">Change Limit</TabsTrigger>
            <TabsTrigger value="pin">Set/Update PIN</TabsTrigger>
          </TabsList>
          
          <TabsContent value="limit">
            <form onSubmit={handleLimitSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-limit" className="text-right">
                    New Limit ($)
                  </Label>
                  <Input
                    id="new-limit"
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLimitLoading}>
                  {isLimitLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Limit
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="pin">
            <form onSubmit={handlePinSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-pin" className="text-right">
                    New 4-Digit PIN
                  </Label>
                  <Input
                    id="new-pin"
                    type="password" // Use password type to hide PIN
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPinLoading}>
                  {isPinLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Set PIN
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}