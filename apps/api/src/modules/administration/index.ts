import { Router } from "express";
import verifyMiddleware from "../middleware/verifyMiddleware";
import clientMiddleware from "../middleware/clientMiddleware";
import createUser from "./routes/users/createUser";
import intent from "./routes/intent";
import getClients from "./routes/clients/getClients";
import createClients from "./routes/clients/createClient";

const adminRouter = Router();

adminRouter.post("/users", clientMiddleware, createUser);
adminRouter.get("/clients", verifyMiddleware, getClients);
adminRouter.post("/clients", verifyMiddleware, createClients);
adminRouter.post("/intent", intent);

export default adminRouter;
