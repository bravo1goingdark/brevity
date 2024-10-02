var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { ValidateRequestBodyCreateUser } from "../../validation/middleware/ValidateRequestBody.js";
import { postSlang } from "../../validation/zod/slang.js";
import Redis from "ioredis";
import { AuthenticateToken } from "../../validation/middleware/authenticateToken.js";
import RateLimiter from "../../validation/middleware/ratelimiter.js";
const slangRouter = Router();
const prisma = new PrismaClient({ log: ["query"] });
const valkey = new Redis(process.env.REDIS_URI);
slangRouter.get("/", RateLimiter(15), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestedTerm } = request.query;
    const cache = yield valkey.get(requestedTerm);
    if (cache) {
        return response.status(200).json(JSON.parse(cache));
    }
    const findTerm = yield prisma.slang.findFirst({
        where: {
            term: requestedTerm,
        },
        include: {
            User: {
                select: {
                    username: true,
                    role: true,
                },
            },
        },
    });
    if (!findTerm) {
        return response.status(404).json({
            msg: "slang term not found",
        });
    }
    const { term, definition, context, origin, likes, User, id } = findTerm;
    yield valkey.setex(requestedTerm, 1800, JSON.stringify({
        term,
        definition,
        context,
        origin,
        likes,
        id,
        submittedBy: (User === null || User === void 0 ? void 0 : User.username) || "unknown",
        isEnforcer: findTerm.User.role,
    }));
    return response.status(200).json({
        term,
        definition,
        context,
        origin,
        likes,
        id,
        submittedBy: (User === null || User === void 0 ? void 0 : User.username) || "unknown",
        isEnforcer: findTerm.User.role,
    });
}));
slangRouter.post("/contribute", AuthenticateToken, RateLimiter(8), ValidateRequestBodyCreateUser(postSlang), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { term, definition, context, origin } = request.body;
    try {
        const requestedTerm = term;
        const cache = yield valkey.get(requestedTerm);
        if (cache) {
            return response.status(400).json({
                msg: `${term} already exists`,
            });
        }
        const findTerm = yield prisma.slang.findUnique({
            where: {
                term,
            },
        });
        if (findTerm) {
            return response.status(400).json({
                msg: `${term} already exists`,
            });
        }
        const { id } = yield prisma.slang.create({
            data: {
                term: term.toLowerCase(),
                definition,
                context,
                origin,
                userId: request.user.id,
                likes: 0,
            },
        });
        yield valkey.setex(requestedTerm, 1800, JSON.stringify({
            term,
            definition,
            context,
            origin,
            likes: 0,
            id,
            submittedBy: request.user.username || "unknown",
            isEnforcer: request.user.role || "USER",
        }));
        return response.status(201).json({
            msg: `The term ${term} has been successfully contributed with slang-ID ${id}.`,
        });
    }
    catch (error) {
        console.error(`SlangRouter post/contribute : ${error}`);
        return response.status(409).json({
            msg: "An error occurred while contributing the term.",
        });
    }
}));
export default slangRouter;
