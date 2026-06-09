import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });
import express from "express";
import cors from "cors";

import otpRouter from "./otp/otpRouter.js";
import signupRouter from "./signup/signUpRouter.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/otp", otpRouter);
app.use("/signup", signupRouter);

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});
