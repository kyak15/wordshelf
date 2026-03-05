"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWords } from "shared/hooks/queries/useWords";
import { useLibraryBooks } from "shared/hooks/queries/useLibrary";
import { useDueWords } from "shared/hooks/queries/useWords";
import {
  getMasteryLevelCounts,
  getMasteryInfo,
  MASTERY_LEVELS,
} from "shared/constants/mastery";
import type { SavedWordRow } from "shared/types";
import type { LibraryBookWithDetails } from "shared/types";
import Text from "../components/atoms/Text";
import LoadingSpinner from "../components/atoms/LoadingSpinner";
import BookThumbnail from "../components/atoms/BookThumbnail";

const FILTER_ALL = "all";
const FILTER_MASTERY_PREFIX = "mastery_";
const FILTER_BOOK_PREFIX = "book_";

type FilterId = string;

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      as="div"
      color="primary"
      className="mb-2 text-lg font-semibold"
    >
      {title}
    </Text>
  );
}

export default function Flashcards() {
  const { data: words, isLoading: wordsLoading } = useWords();
  const { data: books, isLoading: booksLoading } = useLibraryBooks();
  const { data: dueWords } = useDueWords();

  const [activeFilter, setActiveFilter] = useState<FilterId>(FILTER_ALL);

  const isLoading = wordsLoading || booksLoading;

  const masteryLevels = useMemo(
    () => getMasteryLevelCounts(words),
    [words]
  );

  const wordCountsByBook = useMemo(() => {
    if (!words?.length) return {} as Record<string, number>;
    return words.reduce<Record<string, number>>((acc, w) => {
      acc[w.library_book_id] = (acc[w.library_book_id] ?? 0) + 1;
      return acc;
    }, {});
  }, [words]);

  const filterOptions: { id: FilterId; label: string }[] = useMemo(() => {
    const opts: { id: FilterId; label: string }[] = [
      { id: FILTER_ALL, label: "All Words" },
      ...MASTERY_LEVELS.map((m) => ({
        id: `${FILTER_MASTERY_PREFIX}${m.level}` as FilterId,
        label: m.label,
      })),
    ];
    if (books?.length) {
      opts.push({ id: "divider", label: "───" });
      books.forEach((b: LibraryBookWithDetails) => {
        const count = wordCountsByBook[b.library_book_id] ?? 0;
        if (count > 0) {
          opts.push({
            id: `${FILTER_BOOK_PREFIX}${b.library_book_id}`,
            label: b.book?.title ?? "Unknown",
          });
        }
      });
    }
    return opts;
  }, [books, wordCountsByBook]);

  const filteredWords = useMemo(() => {
    if (!words) return [];
    if (activeFilter === FILTER_ALL) return words;
    if (activeFilter.startsWith(FILTER_MASTERY_PREFIX)) {
      const level = Number(activeFilter.replace(FILTER_MASTERY_PREFIX, ""));
      return words.filter((w) =>
        level === 3 ? w.mastery_level >= 3 : w.mastery_level === level
      );
    }
    if (activeFilter.startsWith(FILTER_BOOK_PREFIX)) {
      const bookId = activeFilter.replace(FILTER_BOOK_PREFIX, "");
      return words.filter((w) => w.library_book_id === bookId);
    }
    return words;
  }, [words, activeFilter]);

  const wordsDueCount =
    dueWords?.filter(
      (w) =>
        !w.is_archived &&
        (w.next_review_at == null ||
          new Date(w.next_review_at) <= new Date())
    ).length ?? 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  const totalWords = words?.length ?? 0;
  if (totalWords === 0) {
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="text-xl font-semibold text-[var(--primary-text)]">
          Flashcards
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-8 text-center">
          <Text as="p" color="primary" className="mb-2 text-lg font-medium">
            No words yet!
          </Text>
          <Text as="p" color="secondary">
            Start building your vocabulary by adding words from your books.
          </Text>
        </div>
      </div>
    );
  }

  const booksWithWords =
    books?.filter(
      (b) => (wordCountsByBook[b.library_book_id] ?? 0) > 0
    ) ?? [];

  return (
    <div className="flex flex-col gap-6 p-4 pb-8">
      <div className="text-xl font-semibold text-[var(--primary-text)]">
        Flashcards
      </div>

      {wordsDueCount > 0 && (
        <section className="rounded-2xl border border-[var(--accent)] bg-[var(--surface)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Text as="p" color="primary" className="font-medium">
              {wordsDueCount} {wordsDueCount === 1 ? "word" : "words"} due for review
            </Text>
            <Link
              href="/flashcards/review"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--primary-text)] hover:opacity-90"
            >
              Start review
            </Link>
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Words by Mastery" />
        <div className="flex flex-col gap-2">
          {masteryLevels.map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() =>
                setActiveFilter(`${FILTER_MASTERY_PREFIX}${item.level}`)
              }
              className="flex items-center justify-between rounded-xl border border-[var(--divider)] bg-[var(--surface)] px-4 py-3 text-left transition hover:opacity-90"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Text as="span" color="primary" className="font-medium">
                  {item.label}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Text as="span" color="primary" className="font-semibold">
                  {item.count}
                </Text>
                <Text as="span" color="secondary" className="text-sm">
                  {item.count === 1 ? "word" : "words"}
                </Text>
              </div>
            </button>
          ))}
        </div>
      </section>

      {booksWithWords.length > 0 && (
        <section>
          <SectionHeader title="Words by Book" />
          <div className="flex flex-col gap-3">
            {booksWithWords.map((book) => {
              const count = wordCountsByBook[book.library_book_id] ?? 0;
              return (
                <Link
                  key={book.library_book_id}
                  href={`/book/${book.library_book_id}`}
                  className="flex items-center gap-4 rounded-xl border border-[var(--divider)] bg-[var(--surface)] p-3 transition hover:opacity-90"
                >
                  <BookThumbnail
                    uri={book.book?.cover_image_url ?? null}
                    size="small"
                  />
                  <div className="min-w-0 flex-1">
                    <Text as="p" color="primary" className="truncate font-medium">
                      {book.book?.title ?? "Unknown"}
                    </Text>
                    {book.book?.author && (
                      <Text as="p" color="secondary" className="truncate text-sm">
                        {book.book.author}
                      </Text>
                    )}
                  </div>
                  <Text as="span" color="secondary" className="shrink-0 text-sm">
                    {count} {count === 1 ? "word" : "words"}
                  </Text>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="All saved words" />
        <div className="mb-3 flex flex-wrap gap-2">
          {filterOptions.map((opt) => {
            if (opt.id === "divider") {
              return (
                <span
                  key="divider"
                  className="text-[var(--secondary-text)]"
                >
                  ───
                </span>
              );
            }
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveFilter(opt.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--primary-text)]"
                    : "bg-[var(--surface)] text-[var(--secondary-text)] hover:bg-[var(--divider)]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {filteredWords.length === 0 ? (
          <div className="rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-6 text-center">
            <Text as="p" color="secondary">
              No words match this filter. Try another.
            </Text>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredWords.map((w: SavedWordRow) => {
              const mastery = getMasteryInfo(w.mastery_level);
              return (
                <li
                  key={w.saved_word_id}
                  className="flex items-start gap-2 rounded-lg border border-[var(--divider)] bg-[var(--surface)] px-3 py-2"
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: mastery.color }}
                    title={mastery.label}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--primary-text)]">
                      {w.text}
                    </p>
                    {w.saved_definition && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-[var(--secondary-text)]">
                        {w.saved_definition}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
