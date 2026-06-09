import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import otpController from "../otp/ClassOtp.js";

class SignUp {
	async signup(
		req: Request<
			{},
			{},
			{ firstName: string; lastName: string; userEmail: string }
		>,
		res: Response,
	) {
		const { firstName, lastName, userEmail } = req.body;

		const user = await prisma.users.findUnique({
			where: {
				email: userEmail,
			},
		});

		if (user) {
			return res.status(403).json({ success: false });
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
			await prisma.users.update({
				where: { email: userEmail },
				data: { isVerified: true },
			});
			return res.status(200).json({ success: true });
		} else {
			// if email isnt sent the user still gets an account but it will be an inactive account
			return res.status(200).json({ success: true });
		}
	}
}

const signUpController = new SignUp();
export default signUpController;
