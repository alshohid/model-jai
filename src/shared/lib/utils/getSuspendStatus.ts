import { RankRowItem } from "@/app/(admin)/admin/_components/users/UserManagement";

export const getSuspendStatus = (item: RankRowItem) => {
  if (item.is_permanent_suspended) return "permanent";
  if (!item.is_permanent_suspended && item.suspended_until) return "temporary";
  return "active";
};
