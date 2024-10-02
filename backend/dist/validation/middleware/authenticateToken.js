import jwt from "jsonwebtoken";
export const AuthenticateToken = (request, response, next) => {
    const token = request.cookies.token;
    if (!token) {
        return response.sendStatus(401);
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return response.sendStatus(403);
        }
        request.user = user; // username , role & id is attached as jwtpayload
        next();
    });
};
