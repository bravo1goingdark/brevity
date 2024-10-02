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
const valkey = new Redis(process.env.REDIS_URI);
export const invalidateCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    if (!key) {
        const keys = yield valkey.keys("*");
        keys.forEach((k) => __awaiter(void 0, void 0, void 0, function* () {
            yield valkey.del(k);
        }));
        return "cache invalidated";
    }
    return yield valkey.del(key);
});
