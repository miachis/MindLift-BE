import { Router } from "express";
import otpController from "./ClassOtp.js";
import validations from "../validations/otp-validator.js";
import accessTokenValidator from "../utility/accessTokenValidator.js";

const otpRouter = Router();

// otp/api/v1/auth/get-otp
otpRouter.post(
	"/api/v1/auth/get-otp",
	validations,
	accessTokenValidator,
	otpController.postRequestHandler,
);

// otp/api/v1/auth/verify-otp
otpRouter.post(
	"/api/v1/auth/verify-otp",
	validations,
	accessTokenValidator,
	otpController.verifyRequestHandler,
);

export default otpRouter;
