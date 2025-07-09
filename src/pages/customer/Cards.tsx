
import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CreditCard, 
  Plus, 
  Eye, 
  EyeOff, 
  Freeze, 
  Settings,
  Wallet,
  Shield,
  Smartphone,
  Globe,
  Lock,
  Unlock
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CustomerCards = () => {
  const [showCardNumbers, setShowCardNumbers] = useState<{[key: string]: boolean}>({});
  const [cardStatuses, setCardStatuses] = useState<{[key: string]: boolean}>({
    'card1': true,
    'card2': true,
    'card3': false,
  });

  const cards = [
    {
      id: 'card1',
      type: 'Debit',
      name: 'Primary Checking',
      number: '4532 1234 5678 9012',
      expiry: '12/27',
      cvv: '123',
      balance: 12847.56,
      color: 'from-blue-600 to-blue-800',
      logo: 'VISA',
    },
    {
      id: 'card2',
      type: 'Credit',
      name: 'Rewards Card',
      number: '5412 8765 4321 0987',
      expiry: '08/26',
      cvv: '456',
      balance: 2350.00,
      limit: 5000.00,
      color: 'from-purple-600 to-purple-800',
      logo: 'MC',
    },
    {
      id: 'card3',
      type: 'Savings',
      name: 'High Yield Savings',
      number: '6011 9876 5432 1098',
      expiry: '03/28',
      cvv: '789',
      balance: 8920.33,
      color: 'from-green-600 to-green-800',
      logo: 'DISC',
    },
  ];

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const toggleCardStatus = (cardId: string) => {
    setCardStatuses(prev => {
      const newStatus = !prev[cardId];
      toast.success(`Card ${newStatus ? 'activated' : 'frozen'} successfully`);
      return {
        ...prev,
        [cardId]: newStatus
      };
    });
  };

  const formatCardNumber = (number: string, show: boolean) => {
    if (show) return number;
    return number.replace(/\d(?=\d{4})/g, '•');
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Cards</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your debit and credit cards</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="space-y-4">
              {/* Card Visual */}
              <div className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-banking-lg hover:shadow-banking-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm opacity-80">{card.type} Card</p>
                    <p className="font-semibold">{card.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">{card.logo}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 p-1 h-auto"
                      onClick={() => toggleCardVisibility(card.id)}
                    >
                      {showCardNumbers[card.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg font-mono tracking-wider">
                    {formatCardNumber(card.number, showCardNumbers[card.id])}
                  </p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80">VALID THRU</p>
                      <p className="font-mono">
                        {showCardNumbers[card.id] ? card.expiry : '••/••'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">CVV</p>
                      <p className="font-mono">
                        {showCardNumbers[card.id] ? card.cvv : '•••'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={cardStatuses[card.id] ? "default" : "secondary"}
                    className={cardStatuses[card.id] ? "bg-green-500" : "bg-red-500"}
                  >
                    {cardStatuses[card.id] ? "Active" : "Frozen"}
                  </Badge>
                </div>
              </div>

              {/* Card Controls */}
              <Card className="shadow-banking">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Balance */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {card.type === 'Credit' ? 'Available Credit' : 'Balance'}
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ${card.balance.toLocaleString()}
                      </p>
                      {card.limit && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          of ${card.limit.toLocaleString()} limit
                        </p>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {cardStatuses[card.id] ? (
                            <Unlock className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">
                            {cardStatuses[card.id] ? 'Card Active' : 'Card Frozen'}
                          </span>
                        </div>
                        <Switch
                          checked={cardStatuses[card.id]}
                          onCheckedChange={() => toggleCardStatus(card.id)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="h-auto py-2">
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2">
                          <Smartphone className="w-4 h-4 mr-1" />
                          Digital
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Card Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-banking text-center">
            <CardContent className="pt-6">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced security features
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-banking text-center">
            <CardContent className="pt-6">
              <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Digital Wallet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add to Apple/Google Pay
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-banking text-center">
            <CardContent className="pt-6">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Global Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use worldwide
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-banking text-center">
            <CardContent className="pt-6">
              <Freeze className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Instant Control</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Freeze/unfreeze anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add New Card Section */}
        <Card className="shadow-banking border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Add a New Card
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get instant access to a new debit or credit card
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Request New Card
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Card Activity */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Recent Card Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { merchant: 'Amazon Purchase', amount: 67.89, card: 'Rewards Card', date: '2024-01-09' },
                { merchant: 'Gas Station', amount: 45.20, card: 'Primary Checking', date: '2024-01-09' },
                { merchant: 'Coffee Shop', amount: 12.50, card: 'Primary Checking', date: '2024-01-08' },
                { merchant: 'Online Subscription', amount: 9.99, card: 'Rewards Card', date: '2024-01-08' },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.merchant}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.card}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">-${transaction.amount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
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

export default CustomerCards;
