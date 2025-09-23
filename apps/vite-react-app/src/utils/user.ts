import { UserProfile } from "@/services/membership";

export const getFullName = (user?: UserProfile): string => {
    return `${user?.first_name} ${user?.last_name}`.trim();
};