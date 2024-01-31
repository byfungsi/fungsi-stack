const suffix = " | Auth By Fungsi";
const withSuffix = (s: string) => `${s}${suffix}`;

export const TITLES = {
  SIGNUP: withSuffix("Sign up"),
  LOGIN: withSuffix("Login"),
} as const;
