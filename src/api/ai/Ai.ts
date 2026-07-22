import type { Request, Response } from "express";

import { GoogleGenAI } from "@google/genai";
import { prisma } from "../../lib/prisma.js";

export const ai = new GoogleGenAI({});

class AI {
	aiPostHandler = async (
		req: Request<{}, {}, { userReport: string; userId: number }>,
		res: Response,
	) => {
		try {
			const { userReport, userId } = req.body;
			const interaction = await ai.interactions.create({
				model: "gemini-3.5-flash",
				input: `
            I want to give you a very strict restriction, 
            I want you to respond to every question asked the same way a professional therapist would,
            any question that isnt relating to the type of questions that are asked during therapies
            should be ignored or made known that you are not engineered to respond to questions
            that arent relating to an actual therapy session, always remember that your main purpose is to give advice in confusion situations,
            always keep a calm and relaxed tone and always try to understand the perspective of the user and respond accordingly,
            You will act as a direct therapist to the user that is always loving and you must always and only support good,
            and always encourage love and peace, The question the user has is this: 
            ${userReport}, generate a response that an actual therapist would give and if the question isnt really a therapy related one,
            let the user know that you cannot answer such question and your main purpose is to promote good living,
            Keep your response concise and extremely accurate,
            avoid generating long responses except it is totally needed and it is centered on the main point,
            do not use special characters like \n\ or aestherics, just simple paragraphs.
			And you will bear the name MindLift and no other name`,
			});
			const geminiResponse = interaction.output_text;

			if (geminiResponse) {
				await prisma.dailyReports.create({
					data: {
						body: userReport,
						authorId: userId,
						appResponse: geminiResponse,
					},
				});
				return res
					.status(200)
					.json({ success: true, result: interaction.output_text });
			}
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Network or Internal server error occured",
			});
		}
	};
}

const aiController = new AI();
export default aiController;
