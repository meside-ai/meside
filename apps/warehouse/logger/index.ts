export type Logger = {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
};

export const getLogger = (name: string): Logger => {
  return {
    error: (...args: any[]) => {
      console.error(name, args);
    },
    warn: (...args: any[]) => {
      console.warn(name, args);
    },
    info: (...args: any[]) => {
      console.info(name, args);
    },
  };
};
