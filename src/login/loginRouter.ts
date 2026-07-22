import { Router } from "express";
import loginController from "./ClassLogin.js";
import validations from "../validations/login-validators.js";

const loginRouter = Router();

// /login
loginRouter.post("/", validations, loginController.postRequestHandler);
loginRouter.post("/otp", validations, loginController.otpLoginHandler);

export default loginRouter;
