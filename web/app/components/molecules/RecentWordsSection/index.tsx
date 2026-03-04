import type { ReactNode } from "react";
import { useWords } from "shared/hooks/queries/useWords";
import { SavedWordRow } from "shared/types";
import SimpleWordCard from "../../atoms/SimpleWordCard";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import EmptyHomeData from "../../atoms/EmptyHomeData";
import Text from "../../atoms/Text";

export default function RecentWordsSection() {
  const { data: words, isLoading } = useWords();

  const recentWords: SavedWordRow[] = words
    ? [...words].sort(
        (a, b) =>
          new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime(),
      )
    : [];
  const displayWords = recentWords.slice(0, 3);

  let content: ReactNode;
  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (displayWords.length === 0) {
    content = (
      <EmptyHomeData text="No words saved yet. Save words from your reading to see them here." />
    );
  } else {
    content = (
      <ul className="flex flex-col h-full justify-evenly w-full space-y-4">
        {displayWords.map((w) => (
          <SimpleWordCard
            key={w.saved_word_id}
            id={w.saved_word_id}
            text={w.text}
            definition={w.saved_definition}
          />
        ))}
      </ul>
    );
  }

  return (
    <section className="flex h-full flex-col">
      <Text as="div" color="primary" className="mb-2 text-lg font-semibold">
        Recently Added Words
      </Text>
      <div className="flex flex-1 flex-col rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-4 items-center">
        {content}
      </div>
    </section>
  );
}
