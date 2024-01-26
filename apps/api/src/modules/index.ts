import { Router } from "express";
import userRouter from "./users/routes";
import authRouter from "./auth";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;
