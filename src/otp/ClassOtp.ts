import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import nodemailer from "nodemailer";

class Otp {
	#transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		pool: true,
		auth: {
			user: `${process.env.APP_USER}`,
			pass: `${process.env.APP_PASSWORD}`,
		},
	});

	#generateOtp(): string {
		const characters = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
		const length = 6;
		let otp = "";

		for (let i = 0; i < length; i++) {
			otp += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		return otp;
	}

	async #sendOtp(email: string): Promise<boolean> {
		const otp: string = this.#generateOtp();

		try {
			await this.#transporter.sendMail({
				from: "MindLift Team <support.mindlift@gmail.com>",
				to: email,
				subject: "Hello, OTP Verification",
				text: "Your Otp is below",
				html: `<b>${otp}</b>`,
			});

			// after sending mail store otp and expiry date

			const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes

			// This prisma query makes sure every email has just one otp by either
			// updating the otp, if it exists,
			// Or creating a new entry in the database if it doesn't exist

			await prisma.otp.upsert({
				where: { email },
				update: { otp, expiry: expiryTime },
				create: { otp, email, expiry: expiryTime },
			});

			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	async #verifyOtp(otp: string, email: string): Promise<boolean> {
		/*
		 * Select the otp from the database using the user email
		 * Make sure otp isnt expired
		 * If the user inputted otp matches the one from the database, grant access
		 */
		const savedOtp = await prisma.otp.findUnique({
			where: { email },
		});

		if (!savedOtp) {
			return false;
		}

		if (savedOtp.otp !== otp) {
			return false;
		}

		if (Date.now() > savedOtp.expiry) {
			// otp has expired
			await prisma.otp.delete({
				where: { email },
			});
			return false;
		}

		await prisma.otp.delete({
			where: { email },
		});

		return true;
	}

	// Express stuffs
	/*
		I used arrow functions to preserve the context of 'this'
		when the handlers gets passed to express
	*/

	postRequestHandler = async (
		req: Request<{}, {}, { userEmail: string }>,
		res: Response,
	) => {
		const { userEmail } = req.body;
		const result = await this.#sendOtp(userEmail);
		if (result) {
			return res.status(200).send({ success: true });
		}
		res.status(500).send({ success: false });
	};

	verifyRequestHandler = async (
		req: Request<{}, {}, { userEmail: string; otp: string }>,
		res: Response,
	) => {
		const { otp, userEmail } = req.body;
		const result = await this.#verifyOtp(otp, userEmail);
		if (result) {
			return res.status(200).send({ success: true });
		}
		res.status(401).send({ success: false });
	};
}

const otpController = new Otp();
export default otpController;
