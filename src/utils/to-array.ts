export const toArray = <T>(value: T | T[]) => {
  if (Array.isArray(value)) return value;

  return [value];
};
