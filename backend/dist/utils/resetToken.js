import jwt from "jsonwebtoken";
import "dotenv/config";
export const generateJwtToken = (email) => {
    const secret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ email }, secret, { expiresIn: "4h" });
    return token;
};
