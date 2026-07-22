import { Router } from "express";
import signUpController from "./ClassSignUp.js";
import validations from "../validations/signup-validators.js";

const signupRouter = Router();

// /signup
signupRouter.post("/", validations, signUpController.signup);

export default signupRouter;
