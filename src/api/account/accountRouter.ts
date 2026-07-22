import { Router } from "express";
import userNamePostHandler from "./username.js";
import validations from "../../validations/nameChange-validator.js";
import signOutPostHandler from "./signOut.js";
import deleteAccountHandler from "./deleteAccount.js";
import accessTokenValidator from "../../utility/accessTokenValidator.js";

const accountRouter = Router();

accountRouter.post(
	"/api/change-username",
	validations,
	accessTokenValidator,
	userNamePostHandler,
);
accountRouter.post("/api/signout", accessTokenValidator, signOutPostHandler);
accountRouter.delete(
	"/api/delete/:id",
	accessTokenValidator,
	deleteAccountHandler,
);

export default accountRouter;
