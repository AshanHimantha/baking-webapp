// src/components/customer/RecipientSearchAndDisplay.tsx
import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, AtSign, User, Hash } from "lucide-react";
import AccountTypeBadge from "@/components/common/AccountTypeBadge";
import apiClient from "@/lib/apiClient"; // Keep apiClient here as it's for search
import { toast } from "sonner"; // For internal search errors
import { useUserStore } from '@/store/userStore';

interface RecipientSearchAndDisplayProps {
  recipient: any | null;
  onRecipientSelected: (user: any) => void;
  onRecipientCleared: () => void;
}

const RecipientSearchAndDisplay: React.FC<RecipientSearchAndDisplayProps> = ({
  recipient,
  onRecipientSelected,
  onRecipientCleared,
}) => {
  const [searchType, setSearchType] = useState<"email" | "username" | "accountno">("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userProfile = useUserStore((state) => state.userProfile);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(!!value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!value) {
        setSearchResults([]);
        setSearchLoading(false);
        setShowDropdown(false);
        return;
      }
      setSearchLoading(true);
      const params: Record<string, string> = {};
      params[searchType] = value;
      apiClient
        .get(`/api/search/users`, { params })
        .then((res) => {
          setSearchResults(res.data || []);
          setShowDropdown(true);
        })
        .catch((err) => {
          setSearchResults([]);
          setShowDropdown(false);
          console.error("User search error:", err);
          toast.error("Failed to search users. Please try again.");
        })
        .finally(() => setSearchLoading(false));
    }, 500);
  };

  const handleSelectUser = (user: any) => {
    onRecipientSelected(user);
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement | HTMLInputElement>) => {
    // Timeout to allow click on dropdown item before blur event hides it
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="space-y-2 ">
      <Label htmlFor="recipient" className="text-gray-600">Recipient</Label>
      {!recipient ? (
        <>
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant={searchType === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("email")}
              className="flex items-center gap-1 h-7 "
            >
              <AtSign className="w-4 h-4" /> Email
            </Button>
            <Button
              type="button"
              variant={searchType === "username" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("username")}
              className="flex items-center gap-1 h-7"
            >
              <User className="w-4 h-4" /> Username
            </Button>
            <Button
              type="button"
              variant={searchType === "accountno" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("accountno")}
              className="flex items-center gap-1 h-7  "
            >
              <Hash className="w-4 h-4" /> Account No
            </Button>
          </div>
          <div className="relative" onBlur={handleBlur} tabIndex={-1}>
            <Input
              id="recipient-search"
              ref={searchInputRef}
              placeholder={`Search by ${searchType}`}
              value={searchQuery}
              onChange={handleSearchInput}
              autoComplete="off"
              className="pr-10"
              onFocus={() => setShowDropdown(!!searchQuery)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {showDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-3 text-center text-gray-500 text-sm">Searching...</div>
                ) : searchResults.filter((user) => user.accountType !== "BILLER").length === 0 ? (
                  <div className="p-3 text-center text-gray-500 text-sm">No users found</div>
                ) : (
                  searchResults
                    .filter((user) => user.accountType !== "BILLER" && user.email !== userProfile.email )
                    .map((user) => (
                      <button
                        key={user.accountNumber}
                        type="button"
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 text-left rounded transition-colors"
                        onClick={() => handleSelectUser(user)}
                      >
                        {user.profilePictureUrl ? (
                          <img
                            src={import.meta.env.VITE_API_BASE_URL + user.profilePictureUrl}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {user.firstName?.[0] || ""}
                            {user.lastName?.[0] || ""}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1">
                            {user.firstName} {user.lastName}
                            <span className="ml-1 text-xs text-gray-400 font-normal">
                              {user.username && `@${user.username}`}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 truncate mb-1">{user.email}</div>
                          <div className="flex items-center gap-2 text-xs ">
                            <AccountTypeBadge type={user.accountType} />
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-gray-500">{user.accountNumber}</span>
                          </div>
                        </div>
                      </button>
                    ))
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="relative justify-between flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50/80 via-white/80 to-gray-50/80 dark:from-gray-900/60 dark:via-gray-800/80 dark:to-gray-900/60 shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Avatar className="h-16 w-16 shadow-md">
              <AvatarImage
              className="object-cover"
                src={import.meta.env.VITE_API_BASE_URL + recipient.profilePictureUrl}
                alt={`${recipient.firstName}'s avatar`}
              />
              <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                {recipient.firstName?.[0] || ""}
                {recipient.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg text-gray-900 dark:text-white truncate">
                  {recipient.firstName} {recipient.lastName}
                </span>
                <AccountTypeBadge type={recipient.accountType} className="rounded-full" />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-mono">{recipient.accountNumber}</span>
                <span className="mx-1">•</span>
                <span>@{recipient.username}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{recipient.email}</span>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row items-center justify-end md:justify-end md:w-auto">
            <div className="hidden md:block h-16 w-px bg-gray-200 dark:bg-gray-700 mx-4" />
            <Button type="button" variant="ghost" onClick={onRecipientCleared} className="text-blue-600 hover:text-blue-800">
              Change Recipient
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientSearchAndDisplay;