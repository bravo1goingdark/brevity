import express from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "../router/userRouter.js";
import slangRouter from "../router/slangRouter.js";
import cookieParser from "cookie-parser";
import compression from "compression";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(compression({
    threshold : 0
}));
app.use(cors({
    origin : ["http://localhost:5173" , "https://7093-2409-40e4-69-4873-4ca8-7e64-cf62-fa0.ngrok-free.app"],
    credentials : true
}));


app.use(userRouter);
app.use(slangRouter);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));