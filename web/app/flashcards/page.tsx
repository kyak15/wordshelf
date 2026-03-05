"use client";

import { useMemo, useState } from "react";
import { useWords } from "shared/hooks/queries/useWords";
import { useLibraryBooks } from "shared/hooks/queries/useLibrary";
import { useDueWords } from "shared/hooks/queries/useWords";
import { useStreak } from "shared/hooks/queries/useStats";
import {
  getMasteryLevelCounts,
  MASTERY_LEVELS,
} from "shared/constants/mastery";
import type { SavedWordRow } from "shared/types";
import Text from "../components/atoms/Text";
import LoadingSpinner from "../components/atoms/LoadingSpinner";
import BookShelf from "../components/molecules/BookShelf";
import DetailedWordCard from "../components/molecules/DetailedWordCard";
import FilterButton from "../components/atoms/FilterButton";
import DropDownFilter from "../components/atoms/DropDownFilter";
import CardsDueBanner from "../components/molecules/CardsDueBanner";

const FILTER_ALL = "all";
const FILTER_MASTERY_PREFIX = "mastery_";
const FILTER_BOOK_PREFIX = "book_";

type SortOption = "due_soon" | "recently_added" | "az" | "mastery";
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "due_soon", label: "Due soon" },
  { value: "recently_added", label: "Recently added" },
  { value: "az", label: "A–Z" },
  { value: "mastery", label: "Mastery" },
];

function sortWords(list: SavedWordRow[], sort: SortOption): SavedWordRow[] {
  const copy = [...list];
  switch (sort) {
    case "due_soon":
      return copy.sort((a, b) => {
        const aDue = a.next_review_at
          ? new Date(a.next_review_at).getTime()
          : 0;
        const bDue = b.next_review_at
          ? new Date(b.next_review_at).getTime()
          : 0;
        return aDue - bDue;
      });
    case "recently_added":
      return copy.sort(
        (a, b) =>
          new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime(),
      );
    case "az":
      return copy.sort((a, b) => a.text.localeCompare(b.text));
    case "mastery":
      return copy.sort((a, b) => a.mastery_level - b.mastery_level);
    default:
      return copy;
  }
}

export default function Flashcards() {
  const { data: words, isLoading: wordsLoading } = useWords();
  const { data: books, isLoading: booksLoading } = useLibraryBooks();
  const { data: dueWords } = useDueWords();
  const { data: streakData } = useStreak();

  const [wordSearch, setWordSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(FILTER_ALL);
  const [bookFilter, setBookFilter] = useState<string>(FILTER_ALL);
  const [sort, setSort] = useState<SortOption>("recently_added");

  const isLoading = wordsLoading || booksLoading;

  const masteryLevels = useMemo(() => getMasteryLevelCounts(words), [words]);

  const statusFilterOptions = useMemo(() => {
    const totalWords = words?.length ?? 0;
    return [
      {
        id: FILTER_ALL,
        label: "All",
        count: totalWords,
        color: null as string | null,
      },
      ...masteryLevels.map((m) => ({
        id: `${FILTER_MASTERY_PREFIX}${m.level}`,
        label: m.label,
        count: m.count,
        color: m.color,
      })),
    ];
  }, [words?.length, masteryLevels]);

  const wordCountsByBook = useMemo(() => {
    if (!words?.length) return {} as Record<string, number>;
    return words.reduce<Record<string, number>>((acc, w) => {
      acc[w.library_book_id] = (acc[w.library_book_id] ?? 0) + 1;
      return acc;
    }, {});
  }, [words]);

  const wordsDueCount =
    dueWords?.filter(
      (w) =>
        !w.is_archived &&
        (w.next_review_at == null || new Date(w.next_review_at) <= new Date()),
    ).length ?? 0;

  const streak = streakData?.currentStreak ?? 0;

  const booksWithWords =
    books?.filter((b) => (wordCountsByBook[b.library_book_id] ?? 0) > 0) ?? [];
  const filteredBooks = useMemo(() => {
    if (!bookSearch.trim()) return booksWithWords;
    const q = bookSearch.toLowerCase().trim();
    return booksWithWords.filter(
      (b) =>
        b.book?.title?.toLowerCase().includes(q) ||
        b.book?.author?.toLowerCase().includes(q),
    );
  }, [booksWithWords, bookSearch]);

  const filteredAndSortedWords = useMemo(() => {
    if (!words) return [];
    let list = words;

    if (statusFilter !== FILTER_ALL) {
      if (statusFilter.startsWith(FILTER_MASTERY_PREFIX)) {
        const level = Number(statusFilter.replace(FILTER_MASTERY_PREFIX, ""));
        list = list.filter((w) =>
          level === 3 ? w.mastery_level >= 3 : w.mastery_level === level,
        );
      }
    }
    if (
      bookFilter !== FILTER_ALL &&
      bookFilter.startsWith(FILTER_BOOK_PREFIX)
    ) {
      const bookId = bookFilter.replace(FILTER_BOOK_PREFIX, "");
      list = list.filter((w) => w.library_book_id === bookId);
    }
    if (wordSearch.trim()) {
      const q = wordSearch.toLowerCase().trim();
      list = list.filter(
        (w) =>
          w.text.toLowerCase().includes(q) ||
          (w.saved_definition?.toLowerCase().includes(q) ?? false),
      );
    }
    return sortWords(list, sort);
  }, [words, statusFilter, bookFilter, wordSearch, sort]);

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
        <h1 className="text-xl font-semibold text-[var(--primary-text)]">
          Flashcards
        </h1>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-8 text-center">
          <Text as="p" color="primary" className="mb-1 font-medium">
            Add your first word
          </Text>
          <Text as="p" color="secondary" className="text-sm">
            Save words from your books to build your vocabulary and review them
            here.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <h1 className="text-xl font-semibold text-[var(--primary-text)]">
        Flashcards
      </h1>

      {wordsDueCount > 0 && (
        <CardsDueBanner wordsDueCount={wordsDueCount} streak={streak} />
      )}

      {/* Row 2: Words (70%) + Books (30%) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <section className="flex min-w-0 flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
              type="search"
              placeholder="Search words…"
              value={wordSearch}
              onChange={(e) => setWordSearch(e.target.value)}
              className="min-w-[140px] flex-1 rounded-lg border border-[var(--divider)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--primary-text)] placeholder:text-[var(--secondary-text)] focus:border-[var(--accent)] focus:outline-none"
            />
            <DropDownFilter
              value={sort}
              setValue={(v) => setSort(v as SortOption)}
              options={SORT_OPTIONS}
              className="relative"
            />
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            {statusFilterOptions.map((opt) => (
              <FilterButton
                key={opt.id}
                id={opt.id}
                label={opt.label}
                count={opt.count}
                color={opt.color}
                isActive={statusFilter === opt.id}
                setStatusFilter={setStatusFilter}
              />
            ))}
            <DropDownFilter
              value={bookFilter}
              setValue={setBookFilter}
              allOptionValue={FILTER_ALL}
              allOptionLabel="Book: All"
              options={booksWithWords.map((b) => ({
                value: `${FILTER_BOOK_PREFIX}${b.library_book_id}`,
                label: b.book?.title ?? "Unknown",
              }))}
            />
          </div>

          {filteredAndSortedWords.length === 0 ? (
            <div className="rounded-xl border border-[var(--divider)] bg-[var(--surface)] p-6 text-center">
              <Text as="p" color="secondary" className="text-sm">
                {wordSearch
                  ? "No words match your search."
                  : statusFilter !== FILTER_ALL
                    ? `No "${MASTERY_LEVELS[Number(statusFilter.replace(FILTER_MASTERY_PREFIX, ""))]?.label ?? statusFilter}" words yet.`
                    : bookFilter !== FILTER_ALL
                      ? "No words in this book."
                      : "No words yet."}
              </Text>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {filteredAndSortedWords.map((w: SavedWordRow) => {
                return (
                  <DetailedWordCard
                    key={w.saved_word_id}
                    saved_word_id={w.saved_word_id}
                    text={w.text}
                    saved_definition={w.saved_definition}
                    saved_part_of_speech={w.saved_part_of_speech}
                    mastery_level={w.mastery_level}
                  />
                );
              })}
            </ul>
          )}
        </section>

        <BookShelf
          bookSearch={bookSearch}
          setBookSearch={setBookSearch}
          filteredBooks={filteredBooks}
          wordCountsByBook={wordCountsByBook}
        />
      </div>
    </div>
  );
}
