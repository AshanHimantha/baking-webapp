// ADDED: Import new hooks, components, and API client
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { AddCardModal } from "@/components/customer/AddCardModal";
import { CardSettingsModal } from "@/components/customer/CardSettingsModal";
import { RevealCardModal } from "@/components/customer/RevealCardModal";
import { IAccount } from "@/components/customer/TransferFromAccountSelect";
import { Loader2 } from "lucide-react"; // ADDED: Loader for loading state

import CustomerLayout from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CreditCard, Plus, Eye, EyeOff, Snowflake, Settings, Wallet, Shield, Smartphone, Globe, Lock, Unlock 
} from "lucide-react";
import { toast } from "sonner";

// ADDED: Interface to match API response for a card
interface IVirtualCard {
  id: number;
  nickname: string;
  maskedCardNumber: string;
  expiryDate: string;
  cvv: string;
  spendingLimit: number;
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
  fullCardNumber?: string; // To hold revealed number
  cardHolderName?: string;
}

const CustomerCards = () => {
  // --- ADDED: State management for API data and modals ---
  const [cards, setCards] = useState<IVirtualCard[]>([]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDetails, setShowFullDetails] = useState<{[key: number]: boolean}>({});
  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealCardId, setRevealCardId] = useState<number | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<IVirtualCard | null>(null);

  // --- ADDED: Function to fetch all data ---
  const fetchData = async () => {
    try {
      const [cardsRes, dashboardRes] = await Promise.all([
        apiClient.get<IVirtualCard[]>('/api/cards/virtual'),
        apiClient.get('/api/dashboard')
      ]);
      setCards(cardsRes.data);
      setAccounts(dashboardRes.data.accounts || []);
    } catch (err) {
      toast.error("Failed to load your card data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- UPDATED: API function to show card details with password modal ---
  const handleToggleCardVisibility = (cardId: number) => {
    if (showFullDetails[cardId]) {
      setShowFullDetails(prev => ({ ...prev, [cardId]: false }));
      return;
    }
    setRevealCardId(cardId);
    setIsRevealModalOpen(true);
  };

  // --- NEW: Function to handle password submit and reveal card ---
  const handleRevealCard = async (password: string) => {
    if (revealCardId == null) return;
    setRevealLoading(true);
    try {
      const response = await apiClient.post(`/api/cards/virtual/${revealCardId}/reveal`, {
        currentPassword: password
      });
      const revealed = response.data;
      setCards(prev => prev.map(c =>
        c.id === revealCardId
          ? {
              ...c,
              fullCardNumber: revealed.cardNumber,
              cvv: revealed.cvv,
              expiryDate: revealed.expiryDate,
              cardHolderName: revealed.cardHolderName
            }
          : c
      ));
      setShowFullDetails(prev => ({ ...prev, [revealCardId]: true }));
      toast.success("Card details revealed.");
      setIsRevealModalOpen(false);
    } catch (err) {
      toast.error("Incorrect password or failed to reveal card.");
      throw err;
    } finally {
      setRevealLoading(false);
      setRevealCardId(null);
    }
  };

  // --- ADDED: API function to freeze/unfreeze card ---
  const handleToggleCardStatus = async (card: IVirtualCard) => {
    const isActivating = card.status !== 'ACTIVE';
    const endpoint = isActivating ? `/api/cards/virtual/${card.id}/unfreeze` : `/api/cards/virtual/${card.id}/freeze`;
    const optimisticStatus = isActivating ? 'ACTIVE' : 'FROZEN';

    setCards(prev => prev.map(c => c.id === card.id ? { ...c, status: optimisticStatus } : c));
    try {
      await apiClient.post(endpoint);
      toast.success(`Card successfully ${isActivating ? 'activated' : 'frozen'}`);
    } catch (err) {
      toast.error("Action failed. Please try again.");
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, status: card.status } : c)); // Revert on error
    }
  };
  
  // --- ADDED: Loading state UI ---
  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-16 lg:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Cards</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your virtual cards</p>
          </div>
          {/* CHANGED: onClick now opens the modal */}
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Button>
        </div>

        {/* Cards Grid - CHANGED: Now uses dynamic data from state */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const showDetails = showFullDetails[card.id];
            const isCardActive = card.status === 'ACTIVE';
            const colors = ['from-blue-600 to-blue-800', 'from-purple-600 to-purple-800', 'from-green-600 to-green-800'];
            const cardColor = colors[index % colors.length];

            return (
              <div key={card.id} className="space-y-4">
                {/* Card Visual */}
                <div className={`relative bg-gradient-to-br ${cardColor} rounded-2xl p-6 text-white shadow-banking-lg hover:shadow-banking-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="absolute top-4 right-4"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-80">Virtual Card</p>
                      <p className="font-semibold">{card.nickname}</p>
                      {showDetails && card.cardHolderName && (
                        <p className="text-xs opacity-80 mt-1">{card.cardHolderName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1 h-auto" onClick={() => handleToggleCardVisibility(card.id)}>
                        {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg font-mono tracking-wider">
                      {showDetails ? card.fullCardNumber : card.maskedCardNumber}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-80">VALID THRU</p>
                        <p className="font-mono">{showDetails ? card.expiryDate : '••/••'}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80">CVV</p>
                        <p className="font-mono">{showDetails ? card.cvv : '•••'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Controls */}
                <Card className="shadow-banking">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Spending Limit</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">${card.spendingLimit.toLocaleString()}</p>
                        </div>
                        <div onClick={() => { setSelectedCard(card); setIsSettingsModalOpen(true); }} variant="outline" size="sm"><Settings className="w-4 h-4 mr-1" /></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {isCardActive ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-red-600" />}
                            <span className="text-sm font-medium">{isCardActive ? 'Card Active' : 'Card Frozen'}</span>
                          </div>
                          <Switch checked={isCardActive} onCheckedChange={() => handleToggleCardStatus(card)} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* --- All other static UI sections remain the same --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{/* ... Card Features ... */}</div>
        <Card className="shadow-banking border-2 border-dashed border-gray-300 dark:border-gray-600">{/* ... Add New Card Section ... */}</Card>
        <Card className="shadow-banking">{/* ... Recent Card Activity ... */}</Card>
      </div>

      {/* --- ADDED: The modals are rendered here but are invisible until opened --- */}
      <AddCardModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSuccess={fetchData} accounts={accounts} />
      <CardSettingsModal isOpen={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} onSuccess={fetchData} card={selectedCard} />
      <RevealCardModal
        isOpen={isRevealModalOpen}
        onOpenChange={setIsRevealModalOpen}
        onSubmit={handleRevealCard}
        loading={revealLoading}
      />

    </CustomerLayout>
  );
};

export default CustomerCards;