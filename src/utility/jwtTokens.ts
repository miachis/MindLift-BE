import type { Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export default async function sendAccessAndRefreshTokens(
	email: string,
	res: Response,
) {
	const payload = { email: email };

	const accessToken = jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign(
		payload,
		`${process.env.REFRESH_TOKEN_SECRET}`,
		{
			expiresIn: "30d",
		},
	);

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		sameSite: "strict",
		secure: false, //change the true before pushing to prod
		path: "/",
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		sameSite: "strict",
		secure: false, //change to true before pushing to prod
		path: "/refresh",
	});

	const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

	const exisitingRefreshToken = await prisma.refreshTokens.findUnique({
		where: { email: email },
	});

	if (exisitingRefreshToken) {
		return;
	}

	await prisma.refreshTokens.create({
		data: {
			refreshToken: hashedRefreshToken,
			email: email,
			expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, //30 days
		},
	});
	return;
}
