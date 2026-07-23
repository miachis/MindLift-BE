import { Router } from "express";
import accessTokenValidator from "../../utility/accessTokenValidator.js";
import dailyReportController from "./dailyReport.js";
import weeklyReportController from "./weeklyReport.js";
import getActivities from "./activities.js";

const reportRouter = Router();

reportRouter.get(
	"/daily",
	accessTokenValidator,
	dailyReportController.getReports,
);

reportRouter.delete(
	"/daily/:id",
	accessTokenValidator,
	dailyReportController.deleteReport,
);

reportRouter.get(
	"/weekly",
	accessTokenValidator,
	weeklyReportController.getReports,
);

reportRouter.post(
	"/weekly",
	accessTokenValidator,
	weeklyReportController.createReport,
);

reportRouter.get("/activities/:authorId", accessTokenValidator, getActivities);

export default reportRouter;
