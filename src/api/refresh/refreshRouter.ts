import { Router } from "express";
import refreshController from "./refresh.js";

const refreshRouter = Router();

refreshRouter.post("/", refreshController.postRequestHandler);

export default refreshRouter;
