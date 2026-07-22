import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export default async function signOutPostHandler(
	req: Request<{}, {}, { email: string }>,
	res: Response,
) {
	try {
		const { email } = req.body;
		const savedRefreshToken = await prisma.refreshTokens.findUnique({
			where: { email },
		});

		if (savedRefreshToken) {
			await prisma.refreshTokens.delete({
				where: { email },
			});

			res.clearCookie("accessToken", {
				sameSite: "strict",
				httpOnly: true,
				path: "/",
				secure: false, // change to true before pushing to prod
			});

			res.clearCookie("refreshToken", {
				sameSite: "strict",
				httpOnly: true,
				path: "/refresh",
				secure: false, // change to true before pushing to prod
			});
			return res.status(200).json({
				success: true,
				message: "Signed out of account successfully",
			});
		} else {
			return res.status(404).json({
				success: false,
				message: "Authentication credential not found",
			});
		}
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error occured" });
	}
}
