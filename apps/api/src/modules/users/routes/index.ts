import { Router } from "express";
import clientMiddleware from "../../middleware/clientMiddleware";
import createUser from "./createUser";

const userRouter = Router();

userRouter.post("/", clientMiddleware, createUser);

export default userRouter;
