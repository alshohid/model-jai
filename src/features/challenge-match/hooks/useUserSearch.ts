/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { useGetUsersForSelectQuery } from "@/redux/features/challenge/challengeManagement";
import { useDebounce } from "@/app/(admin)/admin/hook/useDebounce";
import type { UserForSelect } from "@/types/challenge/challengeTypes";

interface UseUserSearchReturn {
  userSearch: string;
  showUserDropdown: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  users: UserForSelect[];
  isLoading: boolean;
  setUserSearch: React.Dispatch<React.SetStateAction<string>>;
  handleUserSearchChange: (value: string) => void;
  closeDropdown: () => void;
}

export default function useUserSearch(): UseUserSearchReturn {
  const [userSearch, setUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const debouncedUserSearch = useDebounce(userSearch, 400);
  const { data: usersData, isFetching: isLoading } = useGetUsersForSelectQuery(
    { search: debouncedUserSearch },
    { skip: debouncedUserSearch.length < 2 },
  );

  const users = usersData?.data ?? [];

  // Show dropdown when debounced search is long enough
  useEffect(() => {
    if (debouncedUserSearch.length >= 2) {
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
    }
  }, [debouncedUserSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSearchChange = (value: string) => {
    setUserSearch(value);
  };

  const closeDropdown = () => {
    setShowUserDropdown(false);
  };

  return {
    userSearch,
    showUserDropdown,
    dropdownRef,
    users,
    isLoading,
    setUserSearch,
    handleUserSearchChange,
    closeDropdown,
  };
}
