import { Router } from "express";
import otpController from "./ClassOtp.js";

const otpRouter = Router();

// otp/api/v1/auth/get-otp
otpRouter.post("/api/v1/auth/get-otp", otpController.postRequestHandler);

// otp/api/v1/auth/verify-otp
otpRouter.post("/api/v1/auth/verify-otp", otpController.verifyRequestHandler);

export default otpRouter;
