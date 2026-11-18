import { Redis } from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const redisPublish = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

export const redisSubscribe = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
});
