import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

async function getActivities(req: Request, res: Response) {
	try {
		const { authorId } = req.params;
		const userActivities = await prisma.activities.findMany({
			where: { authorId: Number(authorId) },
		});

		if (!userActivities) {
			return res.status(404).json({
				success: false,
				activities: userActivities,
				message: "No activities found",
			});
		}

		return res.status(200).json({
			success: true,
			activities: userActivities,
			message: "Activities retrieved successfully",
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "An error occured" });
	}
}

export default getActivities;
