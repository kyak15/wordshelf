import { Dispatch } from "react";
import Text from "../../atoms/Text";
import Link from "next/link";
import BookThumbnail from "../../atoms/BookThumbnail";

import { LibraryBookWithDetails } from "shared/types";

type BookShelfProps = {
  bookSearch: string;
  setBookSearch: Dispatch<React.SetStateAction<string>>;
  filteredBooks: LibraryBookWithDetails[];
  wordCountsByBook: Record<string, number>;
};

export default function BookShelf({
  bookSearch,
  setBookSearch,
  filteredBooks,
  wordCountsByBook,
}: BookShelfProps) {
  return (
    <aside className="flex min-w-0 flex-col rounded-xl border border-[var(--divider)] bg-[var(--surface)] p-3">
      <h2 className="mb-2 text-sm font-semibold text-[var(--primary-text)]">
        Books
      </h2>
      <input
        type="search"
        placeholder="Search books"
        value={bookSearch}
        onChange={(e) => setBookSearch(e.target.value)}
        className="mb-3 rounded-lg border border-[var(--divider)] bg-[var(--background)] px-2.5 py-1.5 text-sm text-[var(--primary-text)] placeholder:text-[var(--secondary-text)] focus:border-[var(--accent)] focus:outline-none"
      />
      <div className="flex flex-col gap-2 overflow-auto">
        {filteredBooks.length === 0 ? (
          <Text as="p" color="secondary" className="py-2 text-xs">
            {bookSearch.trim()
              ? "No books match your search."
              : "No books with words yet."}
          </Text>
        ) : (
          filteredBooks.map((book) => {
            const count = wordCountsByBook[book.library_book_id] ?? 0;
            return (
              <Link
                key={book.library_book_id}
                href={`/book/${book.library_book_id}`}
                className="flex items-center gap-2 rounded-lg border border-[var(--divider)] p-2 transition hover:bg-[var(--background)]"
              >
                <BookThumbnail
                  uri={book.book?.cover_image_url ?? null}
                  size="small"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--primary-text)]">
                    {book.book?.title ?? "Unknown"}
                  </p>
                  {book.book?.author && (
                    <p className="truncate text-xs text-[var(--secondary-text)]">
                      {book.book.author}
                    </p>
                  )}
                  <p className="text-xs text-[var(--secondary-text)]">
                    {count} {count === 1 ? "word" : "words"}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <Link
        href="/Home"
        className="mt-2 text-xs text-[var(--accent)] hover:underline"
      >
        View all books
      </Link>
    </aside>
  );
}
