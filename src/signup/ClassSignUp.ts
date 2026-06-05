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
			return res.status(403).send({ success: false });
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
			return res.status(200).send({ success: true });
		} else {
			return res.status(500).send({ success: false });
		}
	}
}

const signUpController = new SignUp();
export default signUpController;
