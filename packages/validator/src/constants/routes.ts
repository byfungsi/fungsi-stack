export const ROUTES = {
  login: "/auth/login",
  verify: "/auth/verify",
  logout: "/auth/logout",
  intent: "/administration/intent",
  administrationUsers: "/administration/users",
  administrationClients: "/administration/clients",
} as const;

export const withBaseUrl = (path: string) => `/api${path}`;
