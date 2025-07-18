import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RevealCardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (password: string) => Promise<void>;
  loading: boolean;
}

export const RevealCardModal = ({ isOpen, onOpenChange, onSubmit, loading }: RevealCardModalProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Password is required");
      return;
    }
    try {
      await onSubmit(password);
      setPassword("");
      onOpenChange(false);
    } catch (err) {
      setError("Incorrect password or failed to reveal card.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Enter Password to Reveal Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Revealing..." : "Reveal Card"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
