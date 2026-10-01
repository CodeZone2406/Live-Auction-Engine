import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisPublish = new Redis(redisUrl);
export const redisSubscribe = new Redis(redisUrl);