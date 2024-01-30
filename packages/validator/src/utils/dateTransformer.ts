export const stringToDateTransformer = (v: any): Date => {
  if (typeof v === "string") {
    return new Date(v);
  }
  return v;
};
