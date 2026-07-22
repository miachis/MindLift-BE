import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

class DailyReports {
	getReports = async (req: Request, res: Response) => {
		if (req.user) {
			const userDailyReports = await prisma.users.findUnique({
				where: { email: req.user.email },
				include: { dailyReports: true },
			});

			if (!userDailyReports) {
				return res
					.status(404)
					.json({ success: false, message: `No daily reports` });
			}

			return res.status(200).json({
				success: true,
				reports: userDailyReports,
				message: `Daily reports retrieved successfully `,
			});
		}
	};

	deleteReport = async (req: Request, res: Response) => {
		if (req.user) {
			try {
				const { id } = req.params;
				const report = await prisma.dailyReports.delete({
					where: { id: Number(id) },
				});

				await prisma.activities.create({
					data: {
						header: "Deleted a report",
						body: report.body,
						authorId: report.authorId,
						isDailyReport: true,
					},
				});

				const newReports = await prisma.users.findUnique({
					where: { email: req.user.email },
					include: { dailyReports: true },
				});

				return res.status(200).json({
					success: true,
					reports: newReports,
					message: "Report deleted successfully",
				});
			} catch (error) {
				return res
					.status(500)
					.json({ success: false, message: "An error occured" });
			}
		}
	};
}

const dailyReportController = new DailyReports();
export default dailyReportController;
