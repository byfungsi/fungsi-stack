export const ROUTES = {
  login: "/auth/login",
  verify: "/auth/verify",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  intent: "/administration/intent",
  administrationUsers: "/administration/users",
  administrationClients: "/administration/clients",
} as const;

export const removeBaseSlash = (path: string) => path.replace(/^\//, "");
export const withBaseUrl = (path: string) => `/api${path}`;
