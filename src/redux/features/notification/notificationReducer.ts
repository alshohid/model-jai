"use client";

import { IAppNotificationItem } from "@/types/notifications/NotitficationsTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface INotificationState {
  items: IAppNotificationItem[];
  unreadCount: number;
  isHydrated: boolean;
}

const initialState: INotificationState = {
  items: [],
  unreadCount: 0,
  isHydrated: false,
};

const countUnread = (items: IAppNotificationItem[]) =>
  items.filter((item) => !item.read).length;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<IAppNotificationItem[]>,
    ) => {
      state.items = action.payload;
      state.unreadCount = countUnread(action.payload);
      state.isHydrated = true;
    },

    addNotification: (state, action: PayloadAction<IAppNotificationItem>) => {
      console.log("action.payload", action.payload);
      const exists = state.items.some((item) => item.id === action.payload.id);
      console.log("exists", exists);
      if (!exists) {
        state.items = [action.payload, ...state.items];
        state.unreadCount = countUnread(state.items);
      }
      state.isHydrated = true;
    },

    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload ? { ...item, read: true } : item,
      );
      state.unreadCount = countUnread(state.items);
    },

    markAllNotificationsAsRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, read: true }));
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.isHydrated = true;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
