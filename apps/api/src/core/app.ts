import "../utils/configureDotEnv";
import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { API_PORT, ORIGINS } from "../constants/apiEnvs";
import apiRouter from "../modules";
import morganMiddleware from "./morganMiddleware";
import errorHandler from "./errorHandler";
export const app = express();

app.use(
  cors({
    origin: ORIGINS,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compression());
app.use(morganMiddleware);

// app.use("trust proxy");

app.use("/api", apiRouter);

app.get("/health", async (_req: Request, res: Response) =>
  res.json({
    message: "app is running",
  }),
);

app.use(errorHandler);
if (process.env.NODE_ENV !== "test") {
  app.listen(API_PORT, () => {
    console.log(`Server is running on port ${API_PORT}`);
  });
}
