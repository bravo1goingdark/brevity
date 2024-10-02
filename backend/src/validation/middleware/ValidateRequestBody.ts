import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { ResponseSkeleton } from "../../@types/userTypes";

export const ValidateRequestBodyCreateUser = (schema: ZodSchema) => (request: Request, response: Response<ResponseSkeleton>, next: NextFunction) => {
    try {
      schema.parse(request.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error)
        response.status(400).json({
          msg : error.issues.map(issue => issue.message)
        });
      } else {
        next(error);
      }
    }
  };
