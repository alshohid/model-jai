"use client";

import { useAppSelector } from "@/redux/store";
import {
  useMarkNotificationAsReadMutation,
  useClearAllNotificationsMutation,
  useClearSingleNotificationMutation,
} from "@/redux/features/notification/notificationManagement";

export function useNotifications() {
  const notifications = useAppSelector((state) => state.notification.items);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  const isHydrated = useAppSelector((state) => state.notification.isHydrated);

  const [markNotificationAsReadMutation, { isLoading: isMarkingRead }] =
    useMarkNotificationAsReadMutation();

  const [clearAllNotificationsMutation, { isLoading: isClearingAll }] =
    useClearAllNotificationsMutation();

  const [clearSingleNotificationMutation, { isLoading: isClearingSingle }] =
    useClearSingleNotificationMutation();

  const markOneRead = async (id: string) => {
    try {
      await markNotificationAsReadMutation(id).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      return false;
    }
  };

  const markAllRead = async () => {
    try {
      const unreadIds = notifications
        .filter((item) => !item.read)
        .map((item) => item.id);

      await Promise.all(
        unreadIds.map((id) => markNotificationAsReadMutation(id).unwrap()),
      );

      return true;
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
      return false;
    }
  };

  const clearOne = async (id: string) => {
    try {
      await clearSingleNotificationMutation(id).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to clear notification", error);
      return false;
    }
  };

  const clearAll = async () => {
    try {
      await clearAllNotificationsMutation().unwrap();
      return true;
    } catch (error) {
      console.error("Failed to clear all notifications", error);
      return false;
    }
  };
  const notificationsWithRules = notifications.filter(
    (n) => n.rules && n.rules.trim().length > 0,
  );

  const getRulesById = (id: string) =>
    notifications.find((n) => n.id === id)?.rules ?? null;

  return {
    notifications,
    unreadCount,
    isHydrated,
    markOneRead,
    markAllRead,
    clearOne,
    clearAll,
    isMarkingRead,
    isClearingAll,
    isClearingSingle,
    notificationsWithRules,
    getRulesById,
  };
}
