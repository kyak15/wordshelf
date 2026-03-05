import Link from "next/link";

type CardsDueBannerProps = {
  wordsDueCount: number;
  streak: number;
};

export default function CardsDueBanner({
  wordsDueCount,
  streak,
}: CardsDueBannerProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--divider)] bg-[var(--surface)] px-4 py-3">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-[var(--primary-text)]">
          Cards Due today: <strong>{wordsDueCount}</strong>
        </span>
        {streak > 0 && (
          <span className="text-sm text-[var(--secondary-text)]">
            Streak: <strong>{streak}</strong> days
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/flashcards/review"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--primary-text)] hover:opacity-90"
        >
          Start review
        </Link>
      </div>
    </section>
  );
}
