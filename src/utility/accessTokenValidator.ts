import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtDecodedPayload {
	email: string;
}

export default async function accessTokenValidator(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.cookies.accessToken) {
		try {
			const accessToken: string = req.cookies.accessToken;
			if (accessToken.length > 0) {
				const decodedPayload = jwt.verify(
					accessToken,
					`${process.env.ACCESS_TOKEN_SECRET}`,
				) as JwtDecodedPayload;

				if (decodedPayload) {
					if (!req.user) {
						req.user = { email: decodedPayload.email };
					}
					next();
				} else {
					return res.status(401).json({
						success: false,
						message: "Invalid authentication credential",
					});
				}
			} else {
				return res
					.status(400)
					.json({ success: false, message: "Bad authentication credential" });
			}
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				return res.status(403).json({
					success: false,
					message: "Authentication credential expired",
				});
			}
			return res
				.status(500)
				.json({ success: false, message: "Internal server error occured" });
		}
	} else {
		return res
			.status(404)
			.json({ success: false, message: "Authentication credential not found" });
	}
}
