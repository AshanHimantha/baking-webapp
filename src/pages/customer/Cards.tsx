import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { AddCardModal } from "@/components/customer/AddCardModal";
import { CardSettingsModal } from "@/components/customer/CardSettingsModal";
import { RevealCardModal } from "@/components/customer/RevealCardModal";
import { IAccount } from "@/components/customer/TransferFromAccountSelect";
import CustomerLayout from "@/components/customer/CustomerLayout";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Eye,
  EyeOff,
  Settings,
  Unlock,
  Lock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AccountTypeBadge from "@/components/common/AccountTypeBadge";

// --- Interfaces ---
interface IVirtualCard {
  id: number;
  nickname: string;
  maskedCardNumber: string;
  expiryDate: string;
  cvv: string;
  spendingLimit: number;
  status: "ACTIVE" | "INACTIVE" | "FROZEN";
  fullCardNumber?: string;
  cardHolderName?: string;
}

const CustomerCards = () => {
  const [cards, setCards] = useState<IVirtualCard[]>([]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDetails, setShowFullDetails] = useState<{
    [key: number]: boolean;
  }>({});
  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealCardId, setRevealCardId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<IVirtualCard | null>(null);

  const fetchData = async () => {
    try {
      const [cardsRes, dashboardRes] = await Promise.all([
        apiClient.get<IVirtualCard[]>("/api/cards/virtual"),
        apiClient.get("/api/dashboard"),
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

  const handleToggleCardVisibility = (cardId: number) => {
    if (showFullDetails[cardId]) {
      setShowFullDetails((prev) => ({ ...prev, [cardId]: false }));
      return;
    }
    setRevealCardId(cardId);
    setIsRevealModalOpen(true);
  };

  const handleRevealCard = async (password: string) => {
    if (revealCardId == null) return;
    setRevealLoading(true);
    try {
      const response = await apiClient.post(
        `/api/cards/virtual/${revealCardId}/reveal`,
        {
          currentPassword: password,
        }
      );
      const revealed = response.data;
      setCards((prev) =>
        prev.map((c) =>
          c.id === revealCardId
            ? {
                ...c,
                fullCardNumber: revealed.cardNumber,
                cvv: revealed.cvv,
                expiryDate: revealed.expiryDate,
                cardHolderName: revealed.cardHolderName,
              }
            : c
        )
      );
      setShowFullDetails((prev) => ({ ...prev, [revealCardId]: true }));
      toast.success("Card details revealed.");
      setIsRevealModalOpen(false);
    } catch (err) {
      toast.error("Incorrect password or failed to reveal card.");
    } finally {
      setRevealLoading(false);
      setRevealCardId(null);
    }
  };

  const handleToggleCardStatus = async (card: IVirtualCard) => {
    const isActivating = card.status !== "ACTIVE";
    const endpoint = isActivating
      ? `/api/cards/virtual/${card.id}/unfreeze`
      : `/api/cards/virtual/${card.id}/freeze`;
    const optimisticStatus = isActivating ? "ACTIVE" : "FROZEN";

    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, status: optimisticStatus } : c
      )
    );

    try {
      await apiClient.post(endpoint);
      toast.success(
        `Card successfully ${isActivating ? "activated" : "frozen"}`
      );
    } catch (err) {
      toast.error("Action failed. Please try again.");
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, status: card.status } : c))
      );
    }
  };

  const gradientColors = [
    "from-blue-600 to-blue-900",
    "from-purple-600 to-purple-900",
    "from-green-600 to-green-900",
  ];
  const bgImages = ["/R4.jpg", "/R3.jpg", "/R.jpg"];

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Cards
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your virtual cards
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const showDetails = showFullDetails[card.id];
            const isCardActive = card.status === "ACTIVE";
            const cardColor = gradientColors[index % gradientColors.length];
            const cardBgImage = bgImages[index % bgImages.length];
            const cardOpacity = isCardActive ? "opacity-100" : "opacity-50";

            return (
              <div key={card.id} className={"space-y-4 "}>
                {/* Card UI */}
                <div
                  className={`relative flex-shrink-0 rounded-2xl text-white p-6 flex  flex-col justify-between overflow-hidden transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br ${cardColor} shadow-lg ${cardOpacity}`}
                >
                  {/* Background image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={cardBgImage}
                      alt=""
                      className="w-full h-full object-cover opacity-5"
                    />
                  </div>
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-12 -translate-y-12 opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-8 translate-y-8 opacity-50"></div>

                  {/* Card content */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">Virtual Card</p>
                        <p className="font-semibold text-lg">{card.nickname}</p>
                        {showDetails && card.cardHolderName && (
                          <p className="text-xs opacity-80 mt-1">
                            {card.cardHolderName}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-1 h-auto"
                        onClick={() => handleToggleCardVisibility(card.id)}
                      >
                        {showDetails ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-5">
                      <p className="text-lg font-mono tracking-wider">
                        {showDetails
                          ? card.fullCardNumber
                          : card.maskedCardNumber}
                      </p>

                      <img
                        src={"/chip.webp"}
                        alt=""
                        className="w-16 rotate-90 rounded-s-md "
                      />
                    </div>
                    <div className="flex  justify-between items-center">
                      <div className="flex gap-8 items-end">
                        <div>
                          <p className="text-xs opacity-80">VALID THRU</p>
                          <p className="font-mono">
                            {showDetails ? card.expiryDate : "••/••"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-80">CVV</p>
                          <p className="font-mono">
                            {showDetails ? card.cvv : "•••"}
                          </p>
                        </div>
                      </div>

                      <div className="-mr-6 flex">
                        <img
                          src="/visa.png"
                          alt=""
                          srcset=""
                          className="w-18 h-5 mr-4 mt-2"
                        />

                        <img
                          src={"/orbinw1.png"}
                          alt=""
                          className=" w-28 bg-white p-2 rounded-s-md "
                        />
                      </div>
                    </div>
                  </div>
                </div>

                

                {/* Card Controls */}
                <Card className={"p-1"}>

<div className="w-full  border-gray-200 border border-t-md rounded-md ">
                  <div className="flex items-center justify-between gap-2 px-6 py-2 bg-white rounded-md rounded-b-none  hover:shadow-lg transition-shadow duration-200 ease-in-out">
                    <div className="text-sm text-gray-700 font-semibold">
                      <span className="block text-gray-400 text-xs uppercase">
                        Account No
                      </span>
                      {card.linkedAccountNumber}
                    </div>
                    <AccountTypeBadge type={card.accountType} showText={true} />
                  </div>
                </div>

                  <CardContent className="pt-4 space-y-4">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Spending Limit
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ${card.spendingLimit.toLocaleString()}
                        </p>
                      </div>
                      <div
                        onClick={() => {
                          setSelectedCard(card);
                          setIsSettingsModalOpen(true);
                        }}
                      >
                        <Settings className="w-4 h-4 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isCardActive ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          {isCardActive ? "Card Active" : "Card Frozen"}
                        </span>
                      </div>
                      <Switch
                        checked={isCardActive}
                        onCheckedChange={() => handleToggleCardStatus(card)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Modals */}
        <AddCardModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSuccess={fetchData}
          accounts={accounts}
        />
        <CardSettingsModal
          isOpen={isSettingsModalOpen}
          onOpenChange={setIsSettingsModalOpen}
          onSuccess={fetchData}
          card={selectedCard}
        />
        <RevealCardModal
          isOpen={isRevealModalOpen}
          onOpenChange={setIsRevealModalOpen}
          onSubmit={handleRevealCard}
          loading={revealLoading}
        />
      </div>
    </CustomerLayout>
  );
};

export default CustomerCards;
