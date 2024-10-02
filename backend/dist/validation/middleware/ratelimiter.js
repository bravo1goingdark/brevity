var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URI);
const RateLimiter = (limit, duration = 60) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const ip = req.ip;
        const key = `rate-limiter:${ip}`;
        try {
            const currentCount = yield redis.get(key);
            if (currentCount && parseInt(currentCount) >= limit) {
                return res.status(429).json({
                    msg: "Too many requests, please try again later.",
                });
            }
            yield redis.multi().incr(key).expire(key, duration).exec();
            next();
        }
        catch (error) {
            console.error("Rate limiter error:", error);
            return res.status(500).json({
                msg: "Internal server error.",
            });
        }
    });
};
export default RateLimiter;
