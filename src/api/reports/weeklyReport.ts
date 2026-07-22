import { response, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";

import { ai } from "../ai/Ai.js";

class WeeklyReport {
	reportsArray: string[] = [];
	getReports = async (req: Request, res: Response) => {
		if (req.user) {
			const userWeeklyReports = await prisma.users.findUnique({
				where: { email: req.user.email },
				include: { weeklyReports: true },
			});

			if (!userWeeklyReports) {
				return res
					.status(404)
					.json({ success: false, message: `No weekly reports` });
			}

			return res.status(200).json({
				success: true,
				reports: userWeeklyReports,
				message: `Weeky reports retrieved successfully `,
			});
		}
	};

	createReport = async (
		req: Request<{}, {}, { id: number }>,
		res: Response,
	) => {
		try {
			const { id } = req.body;
			const today = new Date();
			const lastWeek = new Date(today);
			lastWeek.setDate(today.getDate() - 7);
			const userDailyReports = await prisma.dailyReports.findMany({
				where: {
					authorId: id,
					createdAt: {
						gte: lastWeek,
						lte: today,
					},
				},
			});

			if (!userDailyReports) {
				return res
					.status(404)
					.json({ success: false, message: "No daily reports" });
			}

			userDailyReports.map((reportObject) => {
				this.reportsArray.push(reportObject.body);
			});

			const interaction = await ai.interactions.create({
				model: "gemini-3.5-flash",
				input: `${this.reportsArray}, I want you to evaluate as a therapist, 
				the array passed in are some actions my user faced during the course of the week 
				and i want you to generate more like an advice based on that array,
				tell the user how their week went shortly and their feelings throughout the week,
				and give a short and simple advice on how they can improve for the next week,
				always sound calm and willing to promote love and good living.
				Avoid any special characters like \*n** that would ruin the result, 
				just make it a plain string, no extra formatting`,
			});

			if (interaction.output_text) {
				await prisma.weeklyReports.create({
					data: {
						authorId: id,
						body: interaction.output_text,
					},
				});

				const reports = await prisma.users.findUnique({
					where: {
						id: id,
					},
					include: {
						weeklyReports: true,
					},
				});
				return res.status(200).json({
					success: true,
					report: reports,
					message: "weekly report generated",
				});
			}
		} catch (error) {
			return res
				.status(500)
				.json({ success: false, message: "Internal server occured" });
		}
	};
}

const weeklyReportController = new WeeklyReport();
export default weeklyReportController;
