export const ROUTES = {
  intent: "/auth/intent",
  login: "/auth/login",
  user: "/users",
} as const;

export const withBaseUrl = (path: string) => `/api${path}`;
