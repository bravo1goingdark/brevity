import { ZodError } from "zod";
export const ValidateRequestBodyCreateUser = (schema) => (request, response, next) => {
    try {
        schema.parse(request.body);
        console.log(request.body);
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            response.status(400).json({
                msg: error.issues.map(issue => issue.message)
            });
        }
        else {
            next(error);
        }
    }
};
