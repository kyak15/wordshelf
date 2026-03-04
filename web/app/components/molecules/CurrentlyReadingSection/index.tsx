import { useLibraryBooks } from "shared/hooks/queries/useLibrary";
import BookThumbnail from "../../atoms/BookThumbnail";
import Link from "next/link";
import ProgressBar from "../../atoms/ProgressBar";
import { useWords } from "shared/hooks/queries/useWords";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import Text from "../../atoms/Text";

export default function CurrentlyReadingSection() {
  const { data: books, isLoading } = useLibraryBooks();
  const { data: words } = useWords();
  const currentlyReading = books?.filter((b) => b.status === "reading") ?? [];
  const book = currentlyReading[0];
  const learnedWordsLength = words
    ? words?.filter((word) => word.is_archived).length
    : 0;
  const wordsLength = words ? words?.length : 0;
  const coverUrl = book?.book?.cover_image_url ?? null;

  return (
    <section className={`flex flex-col ${book ? "h-full" : ""}`}>
      <Text as="div" color="primary" className="mb-2 text-lg font-semibold">
        Currently Reading
      </Text>
      <div
        className={`rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-4 ${
          isLoading ? "flex justify-center" : book ? "flex flex-1 flex-col" : ""
        }`}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : !book ? (
          <p className="text-sm text-[var(--secondary-text)]">
            No book in progress. Add a book to start tracking.
          </p>
        ) : (
          <Link
            href={`/book/${book.library_book_id}`}
            className="flex min-h-0 items-stretch gap-4"
          >
            <BookThumbnail uri={coverUrl} size="large" />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-xl font-medium leading-tight text-[var(--primary-text)]">
                {book.book?.title ?? "Unknown"}
              </p>
              {book.book?.author && (
                <p className="mt-1 text-sm text-[var(--secondary-text)]">
                  {book.book.author}
                </p>
              )}
              <div className="mt-auto pt-4">
                <p className="text-sm text-[var(--secondary-text)] pb-1">
                  {learnedWordsLength} / {wordsLength} Words Learned
                </p>
                <ProgressBar
                  numerator={learnedWordsLength}
                  denominator={wordsLength}
                />
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
