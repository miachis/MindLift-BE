import { body } from "express-validator";

const validations = [
	body("firstName").notEmpty().trim().isLength({ min: 1, max: 50 }).escape(),
	body("lastName")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ min: 1, max: 50 })
		.escape(),
];

export default validations;
