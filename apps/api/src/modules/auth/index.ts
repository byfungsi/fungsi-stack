import { Router } from "express";
import clientMiddleware from "../middleware/clientMiddleware";
import login from "./routes/login";
import intent from "./routes/intent";
import verify from "./routes/verify";

const authRouter = Router();

authRouter.post("/intent", intent);
authRouter.post("/login", clientMiddleware, login);
authRouter.post("/verify", clientMiddleware, verify);

export default authRouter;
