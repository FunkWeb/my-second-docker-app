import {Redis} from 'ioredis';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false,
});
//ioredis gir en utviklervennlig API som forenkler integreringen av Redis i Node.js-applikasjoner
