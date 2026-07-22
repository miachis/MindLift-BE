import "express";

interface UserPayload {
	email: string;
}

declare module "express-serve-static-core" {
	interface Request {
		user?: UserPayload;
	}
}
