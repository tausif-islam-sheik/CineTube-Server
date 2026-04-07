import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { IndexRouter } from "./app/routes";

const app: Application = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) =>{
    res.send("CineTube server is running......")
})
app.use("/api/v1", IndexRouter);

export default app;
