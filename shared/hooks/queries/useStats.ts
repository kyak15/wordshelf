import { useQuery } from "@tanstack/react-query";
import { statsService } from "../../services/stats.service";

const STATS_KEYS = {
  all: ["stats"] as const,
  overview: ["stats", "overview"] as const,
  reviewActivity: (days: number) => ["stats", "review-activity", days] as const,
  wordsActivity: (days: number) => ["stats", "words-activity", days] as const,
  streak: ["stats", "streak"] as const,
  milestones: ["stats", "milestones"] as const,
  weeklyReviews: ["stats", "weekly-reviews"] as const,
};

export function useStatsOverview() {
  return useQuery({
    queryKey: STATS_KEYS.overview,
    queryFn: () => statsService.getOverview(),
  });
}

export function useReviewActivity(days: number = 30) {
  return useQuery({
    queryKey: STATS_KEYS.reviewActivity(days),
    queryFn: () => statsService.getReviewActivity(days),
  });
}

export function useWordsActivity(days: number = 30) {
  return useQuery({
    queryKey: STATS_KEYS.wordsActivity(days),
    queryFn: () => statsService.getWordsActivity(days),
  });
}

export function useStreak() {
  return useQuery({
    queryKey: STATS_KEYS.streak,
    queryFn: () => statsService.getStreak(),
  });
}

export function useMilestones() {
  return useQuery({
    queryKey: STATS_KEYS.milestones,
    queryFn: () => statsService.getMilestones(),
  });
}

export function useWeeklyReviews() {
  return useQuery({
    queryKey: STATS_KEYS.weeklyReviews,
    queryFn: () => statsService.getWeeklyReviews(),
  });
}
