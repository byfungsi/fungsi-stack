import { Router } from "express";
import cors from "cors";
import verifyMiddleware from "../middleware/verifyMiddleware";
import clientMiddleware from "../middleware/clientMiddleware";
import createUser from "./routes/users/createUser";
import intent from "./routes/intent";
import getClients from "./routes/clients/getClients";

const adminRouter = Router();

adminRouter.options("*", cors());

adminRouter.post("/users", clientMiddleware, createUser);
adminRouter.get("/clients", verifyMiddleware, getClients);
adminRouter.post("/intent", intent);

export default adminRouter;
