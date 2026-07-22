import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { validationResult } from "express-validator";
import sendAccessAndRefreshTokens from "../utility/jwtTokens.js";
import otpController from "../otp/ClassOtp.js";

class Login {
	postRequestHandler = async (req: Request, res: Response) => {
		const result = validationResult(req);
		if (result.isEmpty()) {
			const { userEmail } = req.body;
			const user = await prisma.users.findUnique({
				where: { email: userEmail },
			});

			if (user) {
				try {
					const emailSent = await otpController.sendOtp(userEmail);
					if (emailSent) {
						return res.status(200).json({
							success: true,
							isEmailSent: true,
							message: "Email sent successful",
						});
					} else {
						return res.status(200).json({
							success: false,
							isEmailSent: false,
							message: "Email send failed",
						});
					}
				} catch (error) {
					return res
						.status(500)
						.json({ success: false, message: "Internal server occured" });
				}
			} else {
				return res
					.status(404)
					.json({ success: false, message: "User not found" });
			}
		} else {
			res.status(400).json({
				succes: false,
				errors: result.array(),
				message: "A validation error occured",
			});
		}
	};

	otpLoginHandler = async (req: Request, res: Response) => {
		const { otp, userEmail } = req.body;
		const otpMatch = await otpController.verifyOtp(otp, userEmail);
		if (otpMatch) {
			sendAccessAndRefreshTokens(userEmail, res);
			return res.status(200).json({ success: true, message: "OTP match" });
		} else {
			return res
				.status(403)
				.json({ success: false, message: "OTP do not match" });
		}
	};
}

const loginController = new Login();
export default loginController;
