export const serializeError = (err: Error) => {
  const serialized = JSON.parse(
    JSON.stringify(err, Object.getOwnPropertyNames(err)),
  );
  delete serialized.stack;

  return serialized;
};
