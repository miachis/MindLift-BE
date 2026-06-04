import "dotenv/config";
import express from "express";

import otpRouter from "./otp/otpRouter.js";

const app = express();
app.use(express.json());

app.use("/otp", otpRouter);

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});
