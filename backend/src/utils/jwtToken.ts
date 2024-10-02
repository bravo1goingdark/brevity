import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateJwtToken = (email: string): string => {
  const secret = process.env.JWT_SECRET_KEY;
  const token: string = jwt.sign({ email }, secret!, { expiresIn: "4h" });
  return token;
};
