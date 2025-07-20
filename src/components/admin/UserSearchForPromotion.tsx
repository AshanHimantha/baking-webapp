// src/components/admin/UserSearchForPromotion.tsx
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import AccountTypeBadge from "@/components/common/AccountTypeBadge";

interface UserSearchProps {
  onUserSelected: (user: any) => void;
  existingEmployees: any[]; // To filter out users who are already employees
}

const UserSearchForPromotion: React.FC<UserSearchProps> = ({ onUserSelected, existingEmployees }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setShowDropdown(true);
    setSearchLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // Search for any user type (CUSTOMER, SAVINGS, etc.) but not employees
      apiClient
        .get(`/api/search/users`, { params: { query: value, limit: 10 } })
        .then((res) => {
          const existingEmployeeUsernames = new Set(existingEmployees.map(e => e.username));
          const filteredResults = res.data.filter(
            (user: any) => !existingEmployeeUsernames.has(user.username)
          );
          setSearchResults(filteredResults || []);
        })
        .catch((err) => {
          setSearchResults([]);
          console.error("User search error:", err);
          toast.error("Failed to search for users.");
        })
        .finally(() => setSearchLoading(false));
    }, 500);
  };
  
  const handleSelectUser = (user: any) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    onUserSelected(user);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="relative" ref={searchInputRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        id="user-search-promote"
        placeholder="Search for a user by email, username, or name..."
        value={searchQuery}
        onChange={handleSearchInput}
        onFocus={() => setShowDropdown(!!searchQuery)}
        autoComplete="off"
        className="pl-10"
      />
      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
          {searchLoading ? (
            <div className="p-3 text-center text-gray-500 text-sm">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-3 text-center text-gray-500 text-sm">No eligible users found.</div>
          ) : (
            searchResults.map((user) => (
              <button
                key={user.accountNumber}
                type="button"
                className="flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 text-left rounded transition-colors"
                onClick={() => handleSelectUser(user)}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.firstName?.[0] || ""}
                  {user.lastName?.[0] || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.firstName} {user.lastName}
                    <span className="ml-2 text-xs text-gray-400 font-normal">@{user.username}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  <AccountTypeBadge type={user.accountType} />
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchForPromotion;