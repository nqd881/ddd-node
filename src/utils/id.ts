import { v4 } from "uuid";

export const generatePrefixedUUID = (prefix: string) => {
  return `${prefix}#${v4()}`;
};
