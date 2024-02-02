import { Router } from "express";
import userRouter from "./users";
import authRouter from "./auth";
import adminRouter from "./administration";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/administration", adminRouter);

export default apiRouter;
