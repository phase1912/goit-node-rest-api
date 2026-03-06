import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, updateAvatar, verifyUser, resendVerify } from "../controllers/authController.js";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema, loginUserSchema, resendVerifySchema } from "../schemas/authSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const authRouter = express.Router();

authRouter.get("/verify/:verificationToken", verifyUser);
authRouter.post("/verify", validateBody(resendVerifySchema), resendVerify);
authRouter.post("/register", validateBody(registerUserSchema), registerUser);
authRouter.post("/login", validateBody(loginUserSchema), loginUser);
authRouter.get("/current", authenticate, getCurrentUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.patch("/avatars", authenticate, uploadAvatar.single("avatar"), updateAvatar);

export default authRouter;