import Redis from 'ioredis';
import { RedisConfig } from './config';

let redis: Redis | undefined = undefined;

export function initRedis(config: RedisConfig): void {
  redis = new Redis(config);
}

export function closeRedis(): void {
  if (redis) {
    redis.disconnect();
    redis = undefined;
  }
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error('Redis not initialized');
  }
  return redis;
}