import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import sendAccessAndRefreshTokens from "../../utility/jwtTokens.js";

interface JwtDecodedRefreshToken extends JwtPayload {
	email: string;
}

class Refresh {
	postRequestHandler = async (req: Request, res: Response) => {
		const refreshToken = req.cookies.refreshToken;
		try {
			if (refreshToken) {
				const decodedRefreshToken = jwt.verify(
					refreshToken,
					`${process.env.REFRESH_TOKEN_SECRET}`,
				) as JwtDecodedRefreshToken;

				if (decodedRefreshToken) {
					const storedRefreshToken = await prisma.refreshTokens.findUnique({
						where: { email: decodedRefreshToken.email },
					});

					if (!storedRefreshToken) {
						return res.status(404).json({
							success: false,
							message: "Authentication credential not found",
						});
					}

					await prisma.refreshTokens.delete({
						where: { email: decodedRefreshToken.email },
					});

					sendAccessAndRefreshTokens(decodedRefreshToken.email, res);

					const loggedInUser = await prisma.users.findUnique({
						where: { email: decodedRefreshToken.email },
					});
					return res.status(200).json({
						success: true,
						user: loggedInUser,
						message: "User returned successfully",
					});
				} else {
					return res.status(401).json({
						success: false,
						message: "Authentication credential is invalid",
					});
				}
			} else {
				return res.status(401).json({
					success: false,
					message: "Authentication credential is required",
				});
			}
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				const decodedRefreshToken = jwt.verify(
					refreshToken,
					`${process.env.REFRESH_TOKEN_SECRET}`,
				) as JwtDecodedRefreshToken;

				await prisma.refreshTokens.delete({
					where: { email: decodedRefreshToken.email },
				});

				return res.status(403).json({
					success: false,
					message: "Authentication credential expired",
				});
			}
			return res
				.status(500)
				.json({ success: false, message: "Internal server error occured" });
		}
	};
}

const refreshController = new Refresh();
export default refreshController;
