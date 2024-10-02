import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import { ResponseSkeleton } from "../../@types/userTypes";

const redis = new Redis(process.env.REDIS_URI!);

const RateLimiter = (limit: number, duration: number = 60) => {
  return async (
    req: Request,
    res: Response<ResponseSkeleton>,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> => {
    const ip = req.ip;
    const key = `rate-limiter:${ip}`;

    try {
      const currentCount: string | null = await redis.get(key);

      if (currentCount && parseInt(currentCount) >= limit) {
        return res.status(429).json({
          msg: "Too many requests, please try again later.",
        });
      }

      await redis.multi().incr(key).expire(key, duration).exec();

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
  };
};

export default RateLimiter;
