import {
  IAppNotificationItem,
  INotificationApiItem,
  IRawNotificationData,
} from "@/types/notifications/NotitficationsTypes";

function getNotificationTitle(type?: string) {
  switch (type) {
    case "match.created":
      return "New Match Available";
    case "admin.withdrawal.created":
      return "New Withdrawal Request";
    case "user.withdrawal.completed":
      return "Withdrawal Completed";
    case "user.withdrawal.declined":
      return "Withdrawal Declined";
    default:
      return "Notification";
  }
}

export function mapSocketMatchCreatedNotification(payload: {
  message: string;
}): IAppNotificationItem {
  return {
    id: `match-created-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    category: "match.created",
    title: "New Match Available",
    message:
      payload.message ||
      "New match available! Go to home to support your favorite player.",
    read: false,
    createdAt: new Date().toISOString(),
    raw: payload,
  };
}

export function mapSocketPrivateNotification(
  payload: IRawNotificationData & { id?: string },
): IAppNotificationItem {
  return {
    id:
      payload.id ||
      `private-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    category: (payload.type as IAppNotificationItem["category"]) || "generic",
    title: getNotificationTitle(payload.type),
    message: payload.message || "You have a new notification.",
    read: false,
    createdAt: new Date().toISOString(),
    raw: payload,
  };
}

export function mapApiNotificationItem(
  item: INotificationApiItem,
): IAppNotificationItem {
  return {
    id: item.id,
    category:
      (item.data?.type as IAppNotificationItem["category"]) || "generic",
    title: getNotificationTitle(item.data?.type),
    message: item.data?.message || "You have a new notification.",
    read: Boolean(item.read_at),
    createdAt: item.created_at,
    raw: item.data,
  };
}
