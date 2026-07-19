const localStorageService = {
  getLocalStorage: (key: string): any => {
    let result: any;
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }

    try {
      const parsed = JSON.parse(item);
      if (!parsed) {
        throw new Error("Empty value");
      }

      result = parsed;
    } catch {
      // Casting to T (which should resolve to string) because JSON.parse would
      // throw an error if "foo" was passed, but properly casting "true" or "1"
      // to their respective types
      result = item as unknown as any;
    }

    return result;
  },

  setLocalStorage: (key: string, valueToStore: any) => {
    try {
      if (typeof valueToStore === "string") {
        localStorage.setItem(key, valueToStore);
      } else if (typeof valueToStore === "undefined") {
        localStorage.setItem(key, "");
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      console.warn(`Could not save ${key} to localStorage`);
    }
  },

  clearKey: (key: string) => {
    localStorage.removeItem(key);
  },

  clearLocalStorage: () => {
    localStorage.clear();
  },
};

export default localStorageService;

export type TLsItem<T> = {
  key: string;
  get: () => T | null | undefined;
  set: (value: T | null | undefined) => void;
  clear: () => void;
};

export const localStorageItem = <T>(
  args: { key: string } & Partial<Omit<TLsItem<T>, "key">>
): TLsItem<T> => {
  return {
    key: args.key,
    get:
      args?.get ||
      (() => {
        return localStorageService.getLocalStorage(args?.key) as T;
      }),
    set:
      args?.set ||
      ((value: T | null | undefined) => {
        return localStorageService.setLocalStorage(args?.key, value);
      }),
    clear:
      args?.clear ||
      (() => {
        return localStorageService.clearKey(args?.key);
      }),
  };
};
