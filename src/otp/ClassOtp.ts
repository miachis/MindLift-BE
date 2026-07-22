import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import sendAccessAndRefreshTokens from "../utility/jwtTokens.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

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

	async sendOtp(email: string): Promise<boolean> {
		const otp: string = this.#generateOtp();

		try {
			await this.#transporter.sendMail({
				from: "MindLift Team <support.mindlift@gmail.com>",
				to: email,
				subject: "Hello, OTP Verification",
				text: "Your Otp is below",
				html: `
				<div>
					<h1>This is your personal OTP code. Do not share with anyone else.</h1>
					<h2>This code expires in 5 minutes</h2>
					<b>${otp}</b>
				</div>
				`,
			});

			// after sending mail store otp and expiry date

			const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes

			// This prisma query makes sure every email has just one otp by either
			// updating the otp, if it exists,
			// Or creating a new entry in the database if it doesn't exist

			const hashedOtp = await bcrypt.hash(otp, 10);
			await prisma.otp.upsert({
				where: { email },
				update: { otp: hashedOtp, expiry: expiryTime },
				create: { otp: hashedOtp, email, expiry: expiryTime },
			});

			return true;
		} catch (err) {
			return false;
		}
	}

	async verifyOtp(otp: string, email: string): Promise<boolean> {
		/*
		 * Select the otp from the database using the user email
		 * Make sure otp isnt expired
		 * If the user inputted otp matches the one from the database, grant access
		 */
		const savedEntry = await prisma.otp.findUnique({
			where: { email },
		});

		if (!savedEntry) {
			return false;
		}

		const match = await bcrypt.compare(otp, savedEntry.otp);
		if (!match) {
			return false;
		}

		if (Date.now() > savedEntry.expiry) {
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
		const result = await this.sendOtp(userEmail);
		if (result) {
			return res
				.status(200)
				.json({ success: true, message: "OTP sent successfully" });
		}
		return res.status(500).json({ success: false, message: "OTP send failed" });
	};

	verifyRequestHandler = async (
		req: Request<{}, {}, { userEmail: string; otp: string }>,
		res: Response,
	) => {
		const { otp, userEmail } = req.body;
		const result: boolean = await this.verifyOtp(otp, userEmail);
		if (result) {
			sendAccessAndRefreshTokens(userEmail, res);
			await prisma.users.update({
				where: { email: userEmail },
				data: { isVerified: true },
			});
			return res
				.status(200)
				.json({ success: true, message: "OTP verified successfully" });
		}
		return res
			.status(401)
			.json({ success: false, message: "OTP verification failed" });
	};
}

const otpController = new Otp();
export default otpController;
