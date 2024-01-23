import { Router } from "express";
import userRouter from "./users/routes";

const apiRouter = Router();

apiRouter.use("/users", userRouter);

export default apiRouter;
