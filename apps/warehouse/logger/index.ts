export type Logger = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: (...args: any[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  warn: (...args: any[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  info: (...args: any[]) => void;
};

export const getLogger = (name: string): Logger => {
  const time = new Date().toISOString();
  return {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    error: (...args: any[]) => {
      console.error(name, time, args);
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    warn: (...args: any[]) => {
      console.warn(name, time, args);
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    info: (...args: any[]) => {
      console.info(name, time, args);
    },
  };
};
