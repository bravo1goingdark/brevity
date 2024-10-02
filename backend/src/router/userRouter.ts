import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import {
  Delete,
  Login,
  QueryVerificationToken,
  ResetPassword,
  ResetPasswordRequest,
  ResponseSkeleton,
  Update,
  User,
} from "../@types/userTypes";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { ValidateRequestBodyCreateUser } from "../validation/middleware/ValidateRequestBody.js";
import {
  deleteUser,
  loginUser,
  resetPasswordRequest,
  resetRequest,
  updateUser,
  zodUser,
} from "../validation/zod/User.js";
import { AuthenticateToken } from "../validation/middleware/authenticateToken.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../utils/mailer.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import RateLimiter from "../validation/middleware/ratelimiter.js";

const userRouter: Router = Router();

const prisma = new PrismaClient({ log: ["query"] });

userRouter.get(
  "/verify-email",
  RateLimiter(4),
  async (
    request: Request<{}, {}, {}, QueryVerificationToken>,
    response: Response<ResponseSkeleton>
  ) => {
    const { token } = request.query;
    const { email } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;
    const verifiedUser = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        username: true,
      },
    });
    if (verifiedUser) {
      const { username } = await prisma.user.update({
        where: {
          username: verifiedUser.username,
        },
        data: {
          isVerified: true,
          updated_at: new Date(),
        },
      });
      return response.status(200).json({
        msg: `email of ${username} is verified succesfully`,
      });
    }

    return response.status(400).json({
      msg: "token invalid",
    });
  }
);

userRouter.post(
  "/register",
  RateLimiter(2 ,3600),
  ValidateRequestBodyCreateUser(zodUser),
  async (request: Request<{}, {}, User>, response: Response) => {
    const { username, email, password } = request.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        username: true,
        id: false,
      },
    });

    if (user) {
      return response.status(400).json({
        msg: "user with this email or username already exist",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const token : string = generateJwtToken(email);

    try {
      await sendVerificationEmail(email, token);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        msg: "Wasn't able to send a verification mail. (server error)",
      });
    }

    await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });

    return response.status(201).json({
      msg: "user created successfully",
      mail: "verification mail sent (Valid only for 4 hours)",
    });
  }
);

userRouter.post(
  "/login",
  RateLimiter(4),
  ValidateRequestBodyCreateUser(loginUser),
  async (
    request: Request<{}, {}, Login>,
    response: Response<ResponseSkeleton>
  ) => {
    const { username, email, password } = request.body;
    const findUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: {
        password: true,
        username: true,
        role : true,
        isVerified : true,
        id:true
      },
    });

    if (!findUser) {
      return response.status(404).json({
        msg: "user not found with this email or username",
      });
    }

    const isEqual: Boolean = await bcrypt.compare(password, findUser.password);
    if (!isEqual) {
      return response.status(400).json({
        msg: "Invalid Credential",
      });
    }

    // user may login after the expiry of the jwt token --> then they would not be able to send verfication email 
    // @depriciated
    if (!findUser.isVerified) {
      return response.status(400).json({
        msg: "please verify your mail to proceed",
      });
    }

    if (isEqual) {
      const token: string = jwt.sign(
        { username: findUser.username , id : findUser.id , role : findUser.role},
        process.env.JWT_SECRET_KEY!,
        { expiresIn: "6h" }
      );

      response.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600 * 1000 * 6,
      });
    }

    return response.status(200).json({
      msg: "logged In Successfully",
    });
  }
);
userRouter.put(
  "/reset-password",
  RateLimiter(5),
  ValidateRequestBodyCreateUser(resetPasswordRequest),
  async (
    request: Request<{}, {}, ResetPassword, QueryVerificationToken>,
    response: Response<ResponseSkeleton>
  ) => {
    const { newPassword } = request.body as ResetPassword;
    const { token } = request.query as QueryVerificationToken;
    try {
      const { email } = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload;

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      
      if (!user) {
        return response.status(400).json({
          msg: "user with this mail id doesn't exist",
        });
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: await bcrypt.hash(newPassword, 10),
        },
      });

      return response.status(201).json({
        msg: `password reset succesfully `,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        msg: "invalid or expired token",
      });
    }
  }
);
userRouter.post(
  "/reset-request",
  RateLimiter(5 , 3 * 3600),
  ValidateRequestBodyCreateUser(resetRequest),
  async (
    request: Request<{}, {}, ResetPasswordRequest>,
    response: Response<ResponseSkeleton>
  ) => {
    const { email } = request.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        username: true,
        isVerified: true,
      },
    });

    if (!user) {
      return response.status(404).json({
        msg: "user with this email does not exist",
      });
    }
    if (!user.isVerified) {
      return response.status(400).json({
        msg: "email not verified",
      });
    }
    const token = generateJwtToken(email);

    try {
      await sendResetPasswordEmail(email, token);
      return response.status(200).json({
        msg: "Reset email sent successfully (Valid only for 4 hour)",
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        msg: "Error sending reset email",
      });
    }
  }
);
userRouter.put(
  "/update",
  AuthenticateToken,
  ValidateRequestBodyCreateUser(updateUser),
  async (
    request: Request<{}, {}, Update>,
    response: Response<ResponseSkeleton>
  ) => {
    const { username, email, password } = request.body;
    if (username === request.user.username) {
      return response.status(404).json({
        msg: "username cannot be same.",
      });
    }

    const findUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: request.user.username },
          { username, NOT: { username: request.user.username } },
        ],
      },
      select: {
        email: true,
        password: true,
        username: true,
      },
    });

    if (!findUser) {
      return response.status(404).json({
        msg: "user not found with this username",
      });
    }

    await prisma.user.update({
      where: {
        username: request.user.username,
      },
      data: {
        username: username ? username : request.user.username,
        email: email ? email : findUser.email,
        password: password
          ? await bcrypt.hash(password, 10)
          : findUser.password,
      },
    });
    return response.status(200).json({
      msg: "updated",
    });
  }
);

userRouter.delete(
  "/delete",
  AuthenticateToken,
  ValidateRequestBodyCreateUser(deleteUser),
  async (
    request: Request<{}, {}, Delete>,
    response: Response<ResponseSkeleton>
  ) => {
    const {
      body: { email, password },
    } = request;

    const findUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!findUser) {
      return response.status(404).json({
        msg: "no user with this email exist",
      });
    }

    const isEqual: Boolean = await bcrypt.compare(password, findUser.password);

    if (!isEqual) {
      return response.status(400).json({
        msg: "Invalid Credential",
      });
    }

    const deletedUser = await prisma.user.delete({
      where: {
        email,
      },
    });

    return response.status(200).json({
      msg: `${deletedUser.username} deleted successfulyy`,
    });
  }
);

// @depriciated
userRouter.get(
  "/user",
  AuthenticateToken,
  async (req: Request, res: Response) => {
    return res.json({
      user: await prisma.user.findMany({
        select: {
          username: true,
          email: true,
          isVerified: true,
        },
      }),
    });
  }
);


export default userRouter;
