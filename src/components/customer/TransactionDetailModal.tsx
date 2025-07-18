import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/apiClient";
import React from "react"; // Ensure React is imported for JSX

// Simplified animation variants for a cleaner feel
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TransactionDetailModal = ({ isOpen, onClose, details, isLoading }) => {
  const [downloading, setDownloading] = React.useState(false);
  if (!isOpen) {
    return null;
  }

  // Function to handle the download action
  const handleDownloadReceipt = async (transactionId) => {
    if (!transactionId) return;
    setDownloading(true);
    try {
      const response = await apiClient.get(
        `/api/transactions/${transactionId}/receipt`,
        {
          responseType: "blob", // Important for handling file downloads
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download receipt. Please try again later.");
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  // Safely destructure details with fallbacks
  const {
    fromOwnerAvatarUrl,
    toOwnerAvatarUrl,
    fromOwnerName,
    toOwnerName,
    amount = 0,
    transactionDate,
    status,
    description,
    userMemo,
    transactionType,
    id,
  } = details || {};

  // Format date or provide a fallback
  const formattedDate = transactionDate
    ? format(new Date(transactionDate), "MMMM dd, yyyy 'at' hh:mm a")
    : "No date provided";

  // Configuration for transaction statuses
  const statusConfig = {
    COMPLETED: {
      color: "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50",
      icon: CheckCircle,
    },
    PENDING: {
      color: "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/50",
      icon: Clock,
    },
    FAILED: {
      color: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50",
      icon: XCircle,
    },
  };
  const currentStatus = statusConfig[status] || statusConfig.PENDING;

  const renderDetailRow = (label, value) => (
    <motion.div
      variants={itemVariants}
      className="flex justify-between items-start py-3"
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right max-w-[60%] capitalize">
        {value || "N/A"}
      </span>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-sm border border-gray-200 dark:border-gray-700/60 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header and Close Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0"
            >
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Transaction Details
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Modal Content */}
            <div className="overflow-y-auto">
              {isLoading ? (
                <div className="p-10 text-center">
                  <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full mx-auto animate-spin" />
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Loading details...
                  </p>
                </div>
              ) : !details ? (
                <div className="p-10 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <p className="mt-3 text-sm text-red-500">
                    Failed to load transaction details.
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  {/* Amount and Status */}
                  <motion.div
                    variants={itemVariants}
                    className="text-center mb-6"
                  >
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${amount.toFixed(2)}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formattedDate}
                    </p>
                  </motion.div>

                  {/* From/To Participants with Animation */}
                  <motion.div
                    variants={itemVariants}
                    className="mb-6 flex justify-between items-center w-full px-4 relative"
                  >
                    {/* Looping Money Dot Animation */}
          <motion.div
            className="absolute"
            style={{ top: '25%', transform: 'translateY(-10%)' }}
            animate={{
              x: [40, 220],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.2, 0.8, 1],
            }}
          >
            {/* Cash icon from Lucide */}
            <svg
              className="w-8 h-8 text-green-500 absolute left-4 top-1/2 transform -translate-y-1/2 z-[10000] "
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <rect x="2" y="7" width="20" height="10" rx="2" />
              <circle cx="12" cy="12" r="3" />
              <path d="M6 7v2a2 2 0 0 1-2 2" />
              <path d="M18 7v2a2 2 0 0 0 2 2" />
              <path d="M6 17v-2a2 2 0 0 0-2-2" />
              <path d="M18 17v-2a2 2 0 0 1 2-2" />
            </svg>
          </motion.div>

                    {/* From User */}

                    <div className="flex flex-col items-center text-center gap-2 z-10 ">
                      {transactionType === "GIFT" ? (
                        <img
                          src={"/orbinicon.png"}
                          alt="Gift"
                          className="w-16 h-16 rounded-full object-cover animate-pulse-success p-3"
                        />
                      ) : fromOwnerAvatarUrl ? (
                        <img
                          src={import.meta.env.VITE_API_BASE_URL + fromOwnerAvatarUrl}
                          alt={fromOwnerName}
                          className="w-12 h-12 rounded-full object-cover animate-pulse-success "
                          onError={(e) => {
                            e.target.src = "/placeholder-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-300 select-none animate-pulse-success">
                          {fromOwnerName && fromOwnerName.split(" ").length > 1
                            ? `${fromOwnerName.split(" ")[0][0] || ''}${fromOwnerName.split(" ").slice(-1)[0][0] || ''}`.toUpperCase()
                            : fromOwnerName?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          From
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {fromOwnerName}
                        </p>
                      </div>
                    </div>

                    {/* To User */}
                    <div className="flex flex-col items-center text-center gap-2 z-10">
                      {toOwnerAvatarUrl ? (
                        <img
                          src={import.meta.env.VITE_API_BASE_URL + toOwnerAvatarUrl}
                          alt={toOwnerName}
                          className="w-12 h-12 rounded-full object-cover bg-gray-100"
                          onError={(e) => {
                            e.target.src = "/placeholder-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 select-none">
                          {toOwnerName && toOwnerName.split(" ").length > 1
                            ? `${toOwnerName.split(" ")[0][0] || ''}${toOwnerName.split(" ").slice(-1)[0][0] || ''}`.toUpperCase()
                            : toOwnerName?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          To
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {toOwnerName}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Details List */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <motion.div
                      variants={itemVariants}
                      className="flex justify-between items-center py-3"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        Status
                      </span>
                      <Badge
                        className={`${
                          currentStatus.color
                        } text-xs font-medium`}
                      >
                        {status?.charAt(0).toUpperCase() +
                          status?.slice(1).toLowerCase()}
                         
                        <span className="border border-green-500 rounded-full h-4 w-4 flex items-center justify-center bg-green-500">
                          <svg
                            className="w-3 text-white inline"
                            fill="none"
                            viewBox="0 0 16 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 8l3 3 5-5"
                            />
                          </svg>
                        </span>
                      </Badge>
                    </motion.div>

                    {renderDetailRow(
                      "Type",
                      transactionType?.replace("_", " ")
                    )}
                    {renderDetailRow("Description", description)}
                    {userMemo && renderDetailRow("Memo", userMemo)}

                    <motion.div
                      variants={itemVariants}
                      className="flex justify-between items-center pt-3"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Reference ID
                      </span>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                        {id}
                      </span>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Download Button */}
            {!isLoading && details && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex-shrink-0"
              >
                <button
                  onClick={() => !downloading && handleDownloadReceipt(id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-900"
                  disabled={downloading}
                >
                  {downloading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Receipt
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionDetailModal;