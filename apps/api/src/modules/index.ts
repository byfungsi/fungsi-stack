import { Router } from "express";

const apiRouter = Router();

apiRouter.use("/", (req, res) => {
  res.send("hello world");
});

export default apiRouter;
