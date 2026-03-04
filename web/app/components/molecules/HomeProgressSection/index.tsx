import { useStreak, useWeeklyReviews } from "@/shared/hooks/queries/useStats";
import { useWords } from "shared/hooks/queries/useWords";
import ProgressCard from "../../atoms/ProgressCard";

export default function HomeProgressSection() {
  const { data: streakData, isLoading: streakLoading } = useStreak();
  const { data: weeklyReviews, isLoading: weeklyLoading } = useWeeklyReviews();
  const { data: words, isLoading: wordsLoading } = useWords();

  const streak = streakData?.currentStreak ?? 0;
  const weekly = weeklyReviews ?? 0;
  const totalWords = words?.length ?? 0;

  return (
    <section className="flex flex-col">
      <h2 className="mb-2 text-lg font-semibold text-[var(--primary-text)]">
        Your Progress
      </h2>
      <div className="rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-4">
        <div className="grid grid-cols-3 gap-3">
          <ProgressCard
            streak={streak}
            title="day streak"
            loading={streakLoading}
          />
          <ProgressCard
            streak={weekly}
            title="Reviewed This Week"
            loading={weeklyLoading}
          />
          <ProgressCard
            streak={totalWords}
            title="Total Words"
            loading={wordsLoading}
          />
        </div>
      </div>
    </section>
  );
}
