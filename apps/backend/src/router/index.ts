import { Router } from "express";
import { healthRouter } from "./health.router";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);

export { apiRouter };
