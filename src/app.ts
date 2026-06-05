import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });
import express from "express";

import otpRouter from "./otp/otpRouter.js";
import signupRouter from "./signup/singupRouter.js";

const app = express();
app.use(express.json());

app.use("/otp", otpRouter);
app.use("/signup", signupRouter);

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});
