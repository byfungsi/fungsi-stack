import { Router } from "express";
import clientMiddleware from "../middleware/clientMiddleware";
import verifyMiddleware from "../middleware/verifyMiddleware";
import login from "./routes/login";
import verify from "./routes/verify";
import logout from "./routes/logout";
import refreshToken from "./routes/refresh";

const authRouter = Router();

authRouter.post("/login", clientMiddleware, login);
authRouter.post("/logout", verifyMiddleware, logout);
authRouter.post("/refresh", refreshToken);
authRouter.post("/verify", verify);

export default authRouter;
