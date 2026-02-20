import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { statsService } from "../services/stats.service";

export async function getOverviewController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const overview = await statsService.getOverview(req.user.user_id);
    res.json(overview);
  } catch (error) {
    console.error("Error fetching stats overview:", error);
    res.status(500).json({ error: "Failed to fetch stats overview" });
  }
}

export async function getReviewActivityController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
    const activity = await statsService.getReviewActivity(
      req.user.user_id,
      days,
    );
    res.json(activity);
  } catch (error) {
    console.error("Error fetching review activity:", error);
    res.status(500).json({ error: "Failed to fetch review activity" });
  }
}

export async function getWordsActivityController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
    const activity = await statsService.getWordsActivity(
      req.user.user_id,
      days,
    );
    res.json(activity);
  } catch (error) {
    console.error("Error fetching words activity:", error);
    res.status(500).json({ error: "Failed to fetch words activity" });
  }
}

export async function getStreakController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const streak = await statsService.getStreak(req.user.user_id);
    res.json(streak);
  } catch (error) {
    console.error("Error fetching streak:", error);
    res.status(500).json({ error: "Failed to fetch streak" });
  }
}

export async function getMilestonesController(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const [streak, totalReviews, totalDaysActive, booksWithWords] =
      await Promise.all([
        statsService.getStreak(req.user.user_id),
        statsService.getTotalReviews(req.user.user_id),
        statsService.getTotalDaysActive(req.user.user_id),
        statsService.getBooksWithWords(req.user.user_id),
      ]);

    res.json({
      longestStreak: streak.longestStreak,
      totalDaysActive,
      totalReviews,
      booksWithWords,
    });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
}
