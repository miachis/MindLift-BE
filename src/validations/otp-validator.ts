import { body } from "express-validator";

const validations = [
	body("userEmail").notEmpty().trim().isEmail().escape(),
	body("otp").notEmpty().trim().escape(),
];

export default validations;
