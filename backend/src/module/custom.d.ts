import * as express from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user:  JwtPayload;
    }
  }
}
