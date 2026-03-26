const rateLimiters = new Map<string, Map<string, { count: number; resetAt: number }>>();

export function rateLimit(namespace: string, key: string, maxRequests: number, windowMs: number): boolean {
  if (!rateLimiters.has(namespace)) rateLimiters.set(namespace, new Map());
  const store = rateLimiters.get(namespace)!;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false; // not limited
  }

  entry.count++;
  return entry.count > maxRequests; // true if limited
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimiters.values()).forEach((store) => {
    Array.from(store.entries()).forEach(([key, val]) => {
      if (now > val.resetAt) store.delete(key);
    });
  });
}, 5 * 60 * 1000);
