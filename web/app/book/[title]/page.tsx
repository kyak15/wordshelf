"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import {
  useLibraryBook,
  useBookWords,
} from "@/shared/hooks/queries/useLibrary";
import { getMasteryLevelCounts } from "@/shared/constants/mastery";
import type { SavedWordRow } from "@/shared/types";
import Text from "../../components/atoms/Text";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import BookThumbnail from "../../components/atoms/BookThumbnail";
import DetailedWordCard from "../../components/molecules/DetailedWordCard";

export default function BookPage() {
  const params = useParams();
  const libraryBookId = params?.title as string | undefined;

  const {
    data: book,
    isLoading: bookLoading,
    isError: bookError,
  } = useLibraryBook(libraryBookId ?? "");
  const { data: words, isLoading: wordsLoading } = useBookWords(
    libraryBookId ?? "",
  );

  const masteryLevels = useMemo(() => getMasteryLevelCounts(words), [words]);
  const totalWords = words?.length ?? 0;
  const masteredCount = masteryLevels.find((m) => m.level === 3)?.count ?? 0;
  const progressPercent =
    totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;

  if (!libraryBookId) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Text as="p" color="secondary">
          Missing book.
        </Text>
        <Link
          href="/flashcards"
          className="text-sm text-[var(--accent)] hover:underline"
        >
          Back to Flashcards
        </Link>
      </div>
    );
  }

  if (bookLoading || !book) {
    if (bookError) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <Text as="p" color="secondary">
            Book not found.
          </Text>
          <Link
            href="/flashcards"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Back to Flashcards
          </Link>
        </div>
      );
    }
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  const title = book.book?.title ?? "Unknown";
  const author = book.book?.author ?? null;
  const coverUrl = book.book?.cover_image_url ?? null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-8">
      <Link
        href="/flashcards"
        className="text-sm text-[var(--accent)] hover:underline"
      >
        Back to Flashcards
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <BookThumbnail uri={coverUrl} size="large" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-[var(--primary-text)]">
            {title}
          </h1>
          {author && (
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {author}
            </p>
          )}
          <div className="mt-3">
            <p className="text-sm text-[var(--secondary-text)]">
              Words learned:{" "}
              <span className="font-medium text-[var(--primary-text)]">
                {masteredCount}
              </span>{" "}
              / {totalWords} ({progressPercent}% mastered)
            </p>
            <div className="mt-1.5 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[var(--divider)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-[var(--divider)] bg-[var(--surface)] p-3">
        <h2 className="mb-3 text-sm font-semibold text-[var(--primary-text)]">
          Words ({totalWords})
        </h2>
        {wordsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : !words?.length ? (
          <Text as="p" color="secondary" className="py-4 text-sm">
            No words saved from this book yet.
          </Text>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {(words as SavedWordRow[]).map((w) => (
              <DetailedWordCard
                key={w.saved_word_id}
                saved_word_id={w.saved_word_id}
                text={w.text}
                saved_definition={w.saved_definition}
                saved_part_of_speech={w.saved_part_of_speech}
                mastery_level={w.mastery_level}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
