type CacheEntry<T> = {
  data: T;
  expires: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): T | null {
  const item = store.get(key);

  if (!item) return null;

  if (Date.now() > item.expires) {
    store.delete(key);
    return null;
  }

  return item.data as T;
}

export function setCache<T>(
  key: string,
  data: T,
  ttlMs = 1000 * 60
) {
  store.set(key, {
    data,
    expires: Date.now() + ttlMs,
  });
}