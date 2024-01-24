import { Router } from "express";
import login from "./login";
import createUser from "./createUser";

const userRouter = Router();

// userRouter.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     res.json(
//       createSuccessResponse(
//         (await userServices.getAllUser()).map((u) => ZUser.parse(u)),
//       ),
//     );
//   }),
// );

userRouter.post("/", createUser);

userRouter.post("/auth/login", login);

export default userRouter;
