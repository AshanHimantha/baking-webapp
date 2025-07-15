
import { PiggyBank, Banknote, Landmark, BadgeDollarSign, FileWarning } from "lucide-react";
import React from "react"; // Explicitly import React if using JSX

interface AccountTypeBadgeProps {
  type: string;
  className?: string;
  showText?: boolean; // New prop to control whether to show the text label
}

const AccountTypeBadge: React.FC<AccountTypeBadgeProps> = ({ type, className, showText = true }) => {
  const getIcon = () => {
    switch (type) {
      case "SAVING":
        return <PiggyBank className="inline w-4 h-4 text-blue-500" title="SAVING" />;
      case "FIXED":
        return <Banknote className="inline w-4 h-4 text-yellow-500" title="FIXED" />;
      case "CURRENT":
        return <Landmark className="inline w-4 h-4 text-green-500" title="CURRENT" />;
      case "LOAN":
        return <BadgeDollarSign className="inline w-4 h-4 text-red-500" title="LOAN" />;
      default:
        return <FileWarning className="inline w-4 h-4 text-gray-700" title={type} />;
    }
  };

  const getTypeClassName = (accountType: string) => {
    switch (accountType) {
      case "SAVING": return "bg-blue-100 text-blue-700";
      case "FIXED": return "bg-yellow-100 text-yellow-800";
      case "CURRENT": return "bg-green-100 text-green-800";
      case "LOAN": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <span
      title={type}
      className={`inline-flex items-center px-2 py-0.5 rounded-sm font-semibold gap-1 text-xs ${getTypeClassName(type)} ${className || ""}`}
    >
      {getIcon()}
      {showText && <span className="">{type}</span>}
    </span>
  );
};

export default AccountTypeBadge;