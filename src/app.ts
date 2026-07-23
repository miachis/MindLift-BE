import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import otpRouter from "./otp/otpRouter.js";
import signupRouter from "./signup/signUpRouter.js";
import loginRouter from "./login/loginRouter.js";
import mySpaceRouter from "./api/mySpace/mySpaceRouter.js";
import refreshRouter from "./api/refresh/refreshRouter.js";
import accountRouter from "./api/account/accountRouter.js";
import reportRouter from "./api/reports/reportRouter.js";
import aiRouter from "./api/ai/aiRouter.js";

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "https://mind-lift-ashen.vercel.app",
		credentials: true,
	}),
);
app.use(cookieParser());

app.use("/otp", otpRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/myspace", mySpaceRouter);
app.use("/refresh", refreshRouter);
app.use("/account", accountRouter);
app.use("/reports", reportRouter);
app.use("/ai", aiRouter);

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});
