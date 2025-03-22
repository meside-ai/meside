import { first } from "es-toolkit/compat";
import { NotFoundError } from "./error";
import { InternalServerError } from "./error";

export const firstOrNotFound = <T>(array: T[], errorMessage: string) => {
  const item = first(array);
  if (!item) {
    throw new NotFoundError(errorMessage);
  }
  return item;
};

export const firstOrNotCreated = <T>(array: T[], errorMessage: string) => {
  const item = first(array);
  if (!item) {
    throw new InternalServerError(errorMessage);
  }
  return item;
};

export const firstOrNull = <T>(array: T[]) => {
  const item = first(array);
  if (!item) {
    return null;
  }
  return item;
};
