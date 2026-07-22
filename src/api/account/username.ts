// CONTROLLER
import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export default async function userNamePostHandler(req: Request, res: Response) {
	const { firstName, lastName, email } = req.body;
	const user = await prisma.users.findUnique({
		where: { email },
	});

	if (!user) {
		return res.status(404).json({ success: false, message: "User not found" });
	}

	const updatedUser = await prisma.users.update({
		where: { email },
		data: { firstName, lastName },
	});

	return res
		.status(200)
		.json({
			success: false,
			user: updatedUser,
			message: "Name changed successfully",
		});
}
