import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getOverviewController,
  getReviewActivityController,
  getWordsActivityController,
} from "../controller/stats.controller";

export const statsRouter = Router();

statsRouter.use(requireAuth);

statsRouter.get("/overview", getOverviewController); // high-level summary
statsRouter.get("/review-activity", getReviewActivityController); // reviews per day
statsRouter.get("/words-activity", getWordsActivityController); // words saved per day
