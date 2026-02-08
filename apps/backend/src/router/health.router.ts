import { Router } from "express";
import { healthController } from "../controller/health.controller";

export const healthRouter = Router();

healthRouter.get("/", healthController.get);
