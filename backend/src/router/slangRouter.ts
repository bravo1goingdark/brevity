import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { ResponseSkeleton } from "../@types/userTypes.js";
import { ValidateRequestBodyCreateUser } from "../validation/middleware/ValidateRequestBody.js";
import { postSlang } from "../validation/zod/slang.js";
import {
  PostSlangType,
  RequestSlangType,
  SlangResponse,
} from "../@types/slangTypes.js";
import Redis from "ioredis";
import { AuthenticateToken } from "../validation/middleware/authenticateToken.js";
import RateLimiter from "../validation/middleware/ratelimiter.js";
const slangRouter: Router = Router();
const prisma: PrismaClient = new PrismaClient({ log: ["query"] });
const valkey: Redis = new Redis(process.env.REDIS_URI!);

slangRouter.get(
  "/",
  RateLimiter(10),
  async (
    request: Request<{}, {},{}, RequestSlangType>,
    response: Response<ResponseSkeleton | SlangResponse>
  ) => {
    const { requestedTerm } = request.query as RequestSlangType;

    const cache = await valkey.get(requestedTerm.toLowerCase());
    if (cache) {
      return response.status(200).json(JSON.parse(cache));
    }

    const findTerm = await prisma.slang.findFirst({
      where: {
        term: requestedTerm.toLowerCase(),
      },
      include: {
        User: {
          select: {
            username: true,
            role : true,
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
    await valkey.setex(
      requestedTerm,
      1800,
      JSON.stringify({
        term,
        definition,
        context,
        origin,
        likes,
        id,
        submittedBy: User?.username || "unknown",
        isEnforcer: findTerm.User!.role,
      })
    );
    return response.status(200).json({
      term,
      definition,
      context,
      origin,
      likes,
      id,
      submittedBy: User?.username || "unknown",
      isEnforcer: findTerm.User!.role,
    });
  }
);

slangRouter.post(
  "/contribute",
  AuthenticateToken,
  RateLimiter(8),
  ValidateRequestBodyCreateUser(postSlang),
  async (
    request: Request<{}, {}, PostSlangType>,
    response: Response<ResponseSkeleton>
  ) => {
    const { term, definition, context, origin } = request.body;

    try {
      const requestedTerm: string = term;
      const cache = await valkey.get(requestedTerm.toLowerCase());

      if (cache) {
        return response.status(400).json({
          msg: `${term} already exists`,
        });
      }

      const findTerm = await prisma.slang.findUnique({
        where: {
          term,
        },
      });

      if (findTerm) {
        return response.status(400).json({
          msg: `${term} already exists`,
        });
      }

      const { id } = await prisma.slang.create({
        data: {
          term: term.toLowerCase(),
          definition,
          context,
          origin,
          userId: request.user.id,
          likes: 0,
        },
      });

      await valkey.setex(
        requestedTerm,
        1800,
        JSON.stringify({
          term,
          definition,
          context,
          origin,
          likes: 0,
          id,
          submittedBy: request.user.username || "unknown",
          isEnforcer: request.user.role || "USER",
        })
      );

      return response.status(201).json({
        msg: `The term ${term} has been successfully contributed with slang-ID ${id}.`,
      });
    } catch (error) {
      console.error(`SlangRouter post/contribute : ${error}`);
      return response.status(409).json({
        msg: "An error occurred while contributing the term.",
      });
    }
  }
);

slangRouter.put("/update-slang" , async (request:Request , response:Response) => {
  
})

export default slangRouter;
