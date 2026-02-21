import { getApiClient } from "./api";

interface OverviewStats {
  books: {
    total: number;
    by_status: Record<string, number>;
  };
  words: {
    total: number;
    archived: number;
    by_mastery_level: Record<number, number>;
    due_for_review: number;
  };
}

interface ActivityPoint {
  date: string;
  count: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

interface MilestonesData {
  longestStreak: number;
  totalDaysActive: number;
  totalReviews: number;
  booksWithWords: number;
}

export const statsService = {
  async getOverview(): Promise<OverviewStats> {
    const response = await getApiClient().get<OverviewStats>("/stats/overview");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getReviewActivity(days: number = 30): Promise<ActivityPoint[]> {
    const response = await getApiClient().get<ActivityPoint[]>(
      `/stats/review-activity?days=${days}`,
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getWordsActivity(days: number = 30): Promise<ActivityPoint[]> {
    const response = await getApiClient().get<ActivityPoint[]>(
      `/stats/words-activity?days=${days}`,
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getStreak(): Promise<StreakData> {
    const response = await getApiClient().get<StreakData>("/stats/streak");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getMilestones(): Promise<MilestonesData> {
    const response = await getApiClient().get<MilestonesData>("/stats/milestones");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getWeeklyReviews(): Promise<number> {
    const activity = await this.getReviewActivity(7);
    return activity.reduce((sum, day) => sum + Number(day.count), 0);
  },
};
