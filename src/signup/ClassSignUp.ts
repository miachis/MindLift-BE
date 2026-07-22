import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import otpController from "../otp/ClassOtp.js";
import { validationResult } from "express-validator";
import sendAccessAndRefreshTokens from "../utility/jwtTokens.js";

class SignUp {
	async signup(
		req: Request<
			{},
			{},
			{ firstName: string; lastName: string; userEmail: string }
		>,
		res: Response,
	) {
		const result = validationResult(req);
		if (result.isEmpty()) {
			const { firstName, lastName, userEmail } = req.body;

			const user = await prisma.users.findUnique({
				where: {
					email: userEmail,
				},
			});

			if (user) {
				return res
					.status(403)
					.json({ success: false, message: "Email is taken" });
			}

			await prisma.users.create({
				data: {
					firstName: firstName,
					lastName: lastName,
					email: userEmail,
				},
			});

			const emailSent: boolean = await otpController.sendOtp(userEmail);

			if (emailSent) {
				return res.status(200).json({
					success: true,
					isEmailSent: true,
					message: "OTP sent successfully",
				});
			} else {
				// if email isnt sent the user still gets an account but it will be an unverified account
				sendAccessAndRefreshTokens(userEmail, res);
				return res.status(200).json({
					success: true,
					isEmailSent: false,
					message: "OTP failed to send",
				});
			}
		} else {
			return res.status(400).json({
				success: false,
				errors: result.array(),
				message: "A validation error occured",
			});
		}
	}
}

const signUpController = new SignUp();
export default signUpController;
