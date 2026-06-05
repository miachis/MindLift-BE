import { Router } from "express";
import signUpController from "./ClassSignUp.js";

const signupRouter = Router();

// /signup
signupRouter.post("/", signUpController.signup);

export default signupRouter;
