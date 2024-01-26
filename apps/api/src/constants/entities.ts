const ENTITIES = {
  client: "client",
  clientSecret: "clientSecret",
  user: "user",
  accessToken: "accessToken",
  provider: "provider",
} as const;

export type TEntitiesKey = keyof typeof ENTITIES;

export default ENTITIES;
