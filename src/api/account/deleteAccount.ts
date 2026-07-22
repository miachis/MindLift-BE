import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export default async function deleteAccountHandler(
	req: Request<{}, {}, { email: string }>,
	res: Response,
) {
	const { email } = req.body;
	try {
		const user = await prisma.users.findUnique({
			where: { email },
		});
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found" });
		}

		await prisma.$transaction([
			prisma.refreshTokens.delete({
				where: { email },
			}),
			prisma.users.delete({ where: { email } }),
		]);

		return res
			.status(200)
			.json({ success: true, message: "Account deleted successfully" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error occured" });
	}
}
