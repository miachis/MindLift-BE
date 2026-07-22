import { Router } from "express";
import mySpaceController from "./mySpace.js";
import accessTokenValidator from "../../utility/accessTokenValidator.js";

const mySpaceRouter = Router();

mySpaceRouter.get(
	"/",
	accessTokenValidator,
	mySpaceController.getRequestHandler,
);

export default mySpaceRouter;
