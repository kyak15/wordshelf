// hooks/queries/useLibrary.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "../../services/library.service";

const LIBRARY_KEYS = {
  all: ["library"] as const,
  books: ["library", "books"] as const,
  book: (id: string) => ["library", "book", id] as const,
  bookWords: (id: string) => ["library", "book", id, "words"] as const,
};

export function useLibraryBooks() {
  return useQuery({
    queryKey: LIBRARY_KEYS.books,
    queryFn: () => libraryService.getBooks(),
  });
}

export function useLibraryBook(libraryBookId: string) {
  return useQuery({
    queryKey: LIBRARY_KEYS.book(libraryBookId),
    queryFn: () => libraryService.getBook(libraryBookId),
    enabled: !!libraryBookId,
  });
}

export function useBookWords(libraryBookId: string) {
  return useQuery({
    queryKey: LIBRARY_KEYS.bookWords(libraryBookId),
    queryFn: () => libraryService.getBookWords(libraryBookId),
    enabled: !!libraryBookId,
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: {
      title: string;
      author?: string;
      isbn13?: string;
      cover_image_url?: string;
      language_code: string;
    }) => libraryService.addBook(bookData),

    onSuccess: () => {
      // refetch library after adding and invalidate stats
      queryClient.invalidateQueries({ queryKey: LIBRARY_KEYS.books });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateLibraryBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      data,
    }: {
      bookId: string;
      data: {
        status?: string;
        current_page?: number;
        is_favorite?: boolean;
      };
    }) => libraryService.updateBook(bookId, data),

    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_KEYS.book(bookId) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_KEYS.books });
    },
  });
}

export function useDeleteLibraryBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => libraryService.deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_KEYS.books });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
