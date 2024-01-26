const RESOURCES = {
  database: "database",
  cookies: "cookies",
} as const;

export type TResourcesKey = keyof typeof RESOURCES;

export default RESOURCES;
