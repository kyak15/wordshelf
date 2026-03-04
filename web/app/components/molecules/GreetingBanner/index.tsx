import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useDueWords } from "shared/hooks/queries/useWords";
import Icon from "../../atoms/Icon";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning,";
  if (hour >= 12 && hour < 17) return "Good Afternoon,";
  return "Good Evening,";
}

export default function GreetingBanner() {
  const { user } = useAuth();
  const { data: dueWords } = useDueWords();
  const dueCount = dueWords?.length ?? 0;
  const greeting = getGreeting();
  const firstName = user?.given_name || user?.name?.split(" ")[0] || "Reader";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--divider)] bg-[var(--surface)] px-5 py-4">
      <h1 className="text-xl font-semibold text-[var(--primary-text)]">
        {greeting} {firstName}
      </h1>
      {dueCount > 0 && (
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--divider)]"
        >
          <Icon name="lightning" size={20} className="shrink-0" />
          <span className="text-lg">
            {dueCount} {dueCount === 1 ? "card" : "cards"} due
          </span>
          <Icon name="arrow-right" size={16} className="shrink-0" />
        </Link>
      )}
    </div>
  );
}
