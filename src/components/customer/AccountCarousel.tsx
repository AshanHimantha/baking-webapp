import apiClient from "@/lib/apiClient";
import { CreditCard, ShieldCheck, PiggyBank, PlusCircle } from "lucide-react";
import { c } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";

// Define icons and styles for each account type for a creative touch
const accountTypeDetails = {
  CURRENT: {
    icon: CreditCard,
    gradient: "from-blue-400 to-blue-800",
    shadow: "shadow-blue-500/50",
    img: "/R4.jpg",
  },
  SAVING: {
    icon: PiggyBank,
    gradient: "from-green-400 to-green-800",
    shadow: "shadow-green-500/50",
    img: "/R3.jpg",
  },
  FIXED: {
    icon: ShieldCheck,
    gradient: "from-yellow-400 to-yellow-800",
    shadow: "shadow-yellow-500/50",
    img: "/R.jpg",
  },
  DEFAULT: {
    icon: CreditCard,
    gradient: "from-gray-400 to-gray-800",
    shadow: "shadow-gray-500/50",
    img: "/R.jpg",
  },
};

import React, { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const AccountCarousel = ({ accounts, onAccountAdded }) => {
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add new account handler
  const handleAddAccount = async (type) => {
    setLoading(true);
    try {
      await apiClient.post("/api/accounts", { accountType: type });
      setShowTypeModal(false);
      if (onAccountAdded) onAccountAdded();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add account");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic drag constraints
  const containerRef = useRef(null);
  const [dragWidth, setDragWidth] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      setDragWidth(el.scrollWidth - el.clientWidth);
    }
  }, [accounts.length]);

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Your Accounts
      </h2>
      <div className="w-full overflow-x-auto hide-scrollbar">
        <motion.div
          ref={containerRef}
          className="flex space-x-4 sm:space-x-6 pb-4 px-4 p-2 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.15}
        >
          {accounts.map((account) => {
            const details =
              accountTypeDetails[account.accountType] ||
              accountTypeDetails.DEFAULT;
            const Icon = details.icon;

            return (
              <div
                key={account.id}
                className={`relative flex-shrink-0 w-72 h-44 rounded-xl text-white p-6 flex flex-col justify-between overflow-hidden transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br ${details.gradient} shadow-lg ${details.shadow}`}
              >
                {/* Background image with opacity */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={details.img}
                    alt=""
                    className="w-full h-full object-cover opacity-5"
                  />
                </div>
                {/* Abstract background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-12 -translate-y-12 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-8 translate-y-8 opacity-50"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-80">
                        {account.accountType}
                      </p>
                      <p className="font-semibold text-lg">
                        {account.ownerName}
                      </p>
                    </div>
                    <Icon className="w-6 h-6 text-white/80" />
                  </div>
                </div>

                <div className="relative z-10 text-right flex justify-between">

                  <div className="-ml-1 mt-10 p">
                    <img src="/visa.png" alt="logo" className="w-16  p-2 rounded-e-md" />
                  </div>
                  
                <div>
                    <p className="text-sm opacity-80">Balance</p>
                    <p className="text-2xl font-bold">
                      $
                      {(account.balance || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>

                    <p className="text-xs font-mono tracking-widest opacity-80 mt-1">
                      {account.accountNumber}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Placeholder for adding a new account */}

          <div className="flex-shrink-0 w-72 h-44 rounded-xl border border-dashed">
            <button
              type="button"
              onClick={() => setShowTypeModal(true)}
              className="group w-full h-full rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md focus:outline-none relative"
              aria-label="Add New Account"
            >
              <PlusCircle className="w-10 h-10 text-orange-500 mb-2 group-hover:scale-105 transition-transform duration-200" />

              <p className="text-sm font-semibold text-gray-700">
                Add New Account
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Choose account type
              </p>

              <span className="absolute top-2 right-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                + New
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal for account type selection */}
      {showTypeModal && (
        <div className="absolute h-full w-full inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all ">
          <div className="bg-white rounded-2xl shadow-xl  sm:p-8 w-[90%] max-w-sm mx-auto animate-fade-in-up">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-6 mt-4">
              Select Account Type
            </h3>

            <div className="flex flex-col gap-3 px-5 pb-5">
              {/* Creative account type selection buttons */}
              <button
                onClick={() => handleAddAccount("CURRENT")}
                disabled={loading}
                className="flex items-center gap-3 w-full justify-center py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-blue-500/30 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-6 h-6" />
                <span>
                  Add <span className="font-bold">Current</span> Account
                </span>
              </button>

              <button
                onClick={() => handleAddAccount("SAVING")}
                disabled={loading}
                className="flex items-center gap-3 w-full py-3 justify-center rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 shadow-green-500/30 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PiggyBank className="w-6 h-6" />
                <span>
                  Add <span className="font-bold">Saving</span> Account
                </span>
              </button>

              {/* <button
                onClick={() => handleAddAccount("FIXED")}
                disabled={loading}
                className="flex items-center gap-3 w-full py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-yellow-400/30 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <ShieldCheck className="w-6 h-6" />
                <span>
                  Add <span className="font-bold">Fixed</span> Account
                </span>
                </button> */}

              <button
                onClick={() => setShowTypeModal(false)}
                disabled={loading}
                className="text-center text-xs text-gray-500 hover:text-gray-700 hover:underline mt-4 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountCarousel;
