export const SITE_URL = "https://l.devminds.online";
export const DEVMINDS_URL = "https://www.devminds.online/";
export const SHORT_DOMAIN = "l.devminds.online";

// Link limits
export const USER_LINK_LIMIT = 50;
export const SHORT_CODE_LENGTH = 7;

// Roles
export const ROLES = ["USER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];
