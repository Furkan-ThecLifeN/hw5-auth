import express from "express";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from "../controllers/authController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../schemas/authSchema.js";
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerController));
authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginController));
authRouter.post("/refresh", ctrlWrapper(refreshController));
authRouter.post("/logout", ctrlWrapper(logoutController));

export default authRouter;