import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ResponseSkeleton } from "../../@types/userTypes";

export const AuthenticateToken = (
  request: Request,
  response: Response<ResponseSkeleton>,
  next: NextFunction
)  => {
  try {
    const token: string = request.cookies.token;
  
    if (!token) {
      return response.status(403).json({
        msg : "please login first"
      });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, user) => {
      if (err) {
        return response.sendStatus(403);
      }
      request.user = user as JwtPayload; // username , role & id is attached as jwtpayload
      next();
    });
  } catch (error) {
    console.error(`Authenticate Token Middleware Error : ${error}`);
    return response.status(400).json({
      msg : "SERVER ERROR"
    })
  }
};
