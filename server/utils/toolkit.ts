import { first, isEmpty, pick, uniq } from "es-toolkit/compat";
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

export const filterNonEmptyElements = <T>(array: T[]): NonNullable<T>[] => {
  const nonEmptyArray = array.filter((x) => !isEmpty(x));
  return nonEmptyArray as NonNullable<T>[];
};

// TODO: not only string[]
export const pickUniqueExistingKeys = <T>(
  array: T[],
  key: keyof T,
): string[] => {
  return uniq(
    filterNonEmptyElements(array.map((x) => pick(x, key))),
  ) as string[];
};
