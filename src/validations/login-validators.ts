import { body } from "express-validator";

const validations = [
	body("userEmail").notEmpty().trim().isEmail().escape(),
	body("otp").optional({ values: "falsy" }).trim().escape(),
];

export default validations;
