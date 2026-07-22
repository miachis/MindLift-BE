import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

class MySpace {
	getRequestHandler = async (req: Request, res: Response) => {
		try {
			if (req.user) {
				const user = await prisma.users.findUnique({
					where: { email: req.user.email },
				});

				if (!user) {
					return res
						.status(404)
						.json({ success: false, message: "User not found" });
				}

				return res.status(200).json({
					success: true,
					user: user,
					message: "User information retrieved",
				});
			}
		} catch (error) {
			return res
				.status(500)
				.json({ success: false, message: "Internal server error occured" });
		}
	};
}

const mySpaceController = new MySpace();
export default mySpaceController;
