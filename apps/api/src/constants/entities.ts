const ENTITIES = {
  client: "client",
  clientSecret: "clientSecret",
  user: "user",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  provider: "provider",
} as const;

export type TEntitiesKey = keyof typeof ENTITIES;

export default ENTITIES;
