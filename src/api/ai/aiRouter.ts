import { Router } from "express";
import aiController from "./Ai.js";
import accessTokenValidator from "../../utility/accessTokenValidator.js";

const aiRouter = Router();

aiRouter.post("/v1/gemini", accessTokenValidator, aiController.aiPostHandler);

export default aiRouter;
