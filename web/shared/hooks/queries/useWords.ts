import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wordsService } from "../../services/words.service";
import { CreateWordInput, UpdateWordInput } from "../../types";

const WORDS_KEYS = {
  all: ["words"] as const,
  list: (filters?: { bookId?: string; isArchived?: boolean }) =>
    ["words", "list", filters] as const,
  detail: (wordId: string) => ["words", "detail", wordId] as const,
  due: ["words", "due"] as const,
};

export function useWords(options?: { bookId?: string; isArchived?: boolean }) {
  return useQuery({
    queryKey: WORDS_KEYS.list(options),
    queryFn: () => wordsService.getAllWords(options),
  });
}

export function useWord(wordId: string) {
  return useQuery({
    queryKey: WORDS_KEYS.detail(wordId),
    queryFn: () => wordsService.getSingleWord(wordId),
    enabled: !!wordId,
  });
}

export function useDueWords() {
  return useQuery({
    queryKey: WORDS_KEYS.due,
    queryFn: () => wordsService.getDueWords(),
  });
}

export function useAddWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newWord: CreateWordInput) => wordsService.addNewWord(newWord),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORDS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordId, data }: { wordId: string; data: UpdateWordInput }) =>
      wordsService.updateWord(wordId, data),
    onSuccess: (_, { wordId }) => {
      queryClient.invalidateQueries({ queryKey: WORDS_KEYS.detail(wordId) });
      queryClient.invalidateQueries({ queryKey: WORDS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wordId: string) => wordsService.deleteWord(wordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORDS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useReviewWord() {
  return useMutation({
    mutationFn: ({
      wordId,
      review,
    }: {
      wordId: string;
      review: { quality: number };
    }) => wordsService.reviewWord(wordId, review),
    // intentionally dont invalidate queiries her since review session manages local queue
    // Queries will be invalidated when the user leaves the review session.
  });
}
