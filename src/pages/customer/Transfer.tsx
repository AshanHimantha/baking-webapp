
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowRight, 
  Users, 
  CreditCard, 
  CheckCircle,
  DollarSign,
  Send,
  User,
  Calendar,
  RefreshCw,
  Pause,
  Play,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CustomerTransfer = () => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [startDate, setStartDate] = useState("");

  const quickContacts = [
    { id: '1', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/placeholder.svg', initials: 'SW' },
    { id: '2', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/placeholder.svg', initials: 'MJ' },
    { id: '3', name: 'Emma Davis', email: 'emma@example.com', avatar: '/placeholder.svg', initials: 'ED' },
    { id: '4', name: 'Alex Chen', email: 'alex@example.com', avatar: '/placeholder.svg', initials: 'AC' },
  ];

  const recurringTransfers = [
    { 
      id: '1', 
      recipient: 'Sarah Wilson', 
      email: 'sarah@example.com',
      amount: 500, 
      frequency: 'Monthly', 
      nextTransfer: '2024-01-15',
      status: 'active'
    },
    { 
      id: '2', 
      recipient: 'Mike Johnson', 
      email: 'mike@example.com',
      amount: 200, 
      frequency: 'Weekly', 
      nextTransfer: '2024-01-12',
      status: 'paused'
    },
  ];

  const handleTransfer = () => {
    if (!amount || !recipient) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isRecurring && !startDate) {
      toast.error("Please select a start date for recurring transfer");
      return;
    }

    setShowSuccess(true);
    if (isRecurring) {
      toast.success(`Recurring transfer scheduled successfully! Will start on ${startDate}`);
    } else {
      toast.success("Transfer completed successfully!");
    }
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setAmount("");
      setRecipient("");
      setMessage("");
      setSelectedContact(null);
      setIsRecurring(false);
      setFrequency("weekly");
      setStartDate("");
    }, 3000);
  };

  const selectContact = (contact: typeof quickContacts[0]) => {
    setSelectedContact(contact.id);
    setRecipient(contact.email);
  };

  const toggleRecurringTransfer = (id: string, action: 'pause' | 'resume' | 'delete') => {
    if (action === 'delete') {
      toast.success("Recurring transfer cancelled");
    } else if (action === 'pause') {
      toast.success("Recurring transfer paused");
    } else {
      toast.success("Recurring transfer resumed");
    }
  };

  const getFrequencyText = (freq: string) => {
    switch (freq) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      default: return 'Weekly';
    }
  };

  if (showSuccess) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md shadow-banking-lg animate-bounce-in">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-success">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {isRecurring ? 'Recurring Transfer Set Up!' : 'Transfer Successful!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isRecurring 
                  ? `$${amount} will be sent ${getFrequencyText(frequency).toLowerCase()} to ${recipient} starting ${startDate}`
                  : `$${amount} has been sent to ${recipient}`
                }
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRecurring ? 'Schedule ID' : 'Transaction ID'}
                </p>
                <p className="font-mono text-sm text-gray-900 dark:text-white">
                  {isRecurring ? 'SCH' : 'TXN'}-{Date.now()}
                </p>
              </div>
              <Button 
                onClick={() => setShowSuccess(false)}
                className="w-full"
              >
                {isRecurring ? 'Set Up Another' : 'Make Another Transfer'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Send Money
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transfer money to friends, family, or pay bills
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Contacts */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Quick Send
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickContacts.map((contact) => (
                    <Button
                      key={contact.id}
                      variant={selectedContact === contact.id ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => selectContact(contact)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center leading-tight">
                        {contact.name.split(' ')[0]}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transfer Details */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Transfer Details
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="recurring-toggle" className="text-sm font-medium">
                      Recurring
                    </Label>
                    <Switch
                      id="recurring-toggle"
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email or Phone</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter email address or phone number"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 text-lg font-semibold"
                    />
                  </div>
                </div>

                {isRecurring && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a note for the recipient..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {!isRecurring && (
                  <div className="space-y-2">
                    <Label>Quick Amount</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['10', '25', '50', '100'].map((quickAmount) => (
                        <Button
                          key={quickAmount}
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(quickAmount)}
                        >
                          ${quickAmount}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transfer Summary */}
          <div className="space-y-6">
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle>Transfer Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-semibold">${amount || '0.00'}</span>
                  </div>
                  {isRecurring && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Frequency</span>
                      <span className="font-semibold">{getFrequencyText(frequency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fee</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${amount || '0.00'}</span>
                  </div>
                </div>

                {recipient && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sending to:</p>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium truncate">{recipient}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleTransfer}
                  disabled={!amount || !recipient || (isRecurring && !startDate)}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isRecurring ? <Calendar className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  {isRecurring ? 'Schedule Transfer' : 'Send Money'}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {isRecurring 
                    ? 'Recurring transfer will start on the selected date'
                    : 'Transfer will be processed instantly. You can cancel within 30 seconds.'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Account Balance */}
            <Card className="shadow-banking">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Account Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$12,847.56</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available Balance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recurring Transfers */}
        {recurringTransfers.length > 0 && (
          <Card className="shadow-banking">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Active Recurring Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recurringTransfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {transfer.recipient.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transfer.recipient}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transfer.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${transfer.amount} • {transfer.frequency} • Next: {transfer.nextTransfer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transfer.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {transfer.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRecurringTransfer(transfer.id, transfer.status === 'active' ? 'pause' : 'resume')}
                      >
                        {transfer.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRecurringTransfer(transfer.id, 'delete')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transfers */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Sarah Wilson', amount: 150.00, date: '2024-01-08', status: 'completed' },
                { name: 'Mike Johnson', amount: 75.50, date: '2024-01-07', status: 'completed' },
                { name: 'Emma Davis', amount: 200.00, date: '2024-01-05', status: 'completed' },
              ].map((transfer, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {transfer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transfer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transfer.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">-${transfer.amount}</p>
                    <p className="text-sm text-green-600">{transfer.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransfer;
