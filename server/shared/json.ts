export const parseJsonOrNull = <T extends object>(
  content: string,
): T | null => {
  try {
    const json = JSON.parse(content);
    return json as T;
  } catch {
    return null;
  }
};
