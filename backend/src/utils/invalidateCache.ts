import Redis from "ioredis";

const valkey: Redis = new Redis(process.env.REDIS_URI!);

export const invalidateCache = async (key?: string): Promise<number | string> => {
  if (!key) {
    const keys: string[] = await valkey.keys("*");

    keys.forEach(async (k) => {
      await valkey.del(k);
    });

    return "cache invalidated";
  }

  return await valkey.del(key);
};
