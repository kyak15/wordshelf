import {
  CreateWordInput,
  SavedWordRow,
  UpdateWordInput,
  SubmitReviewInput,
} from "../types";
import { getApiClient } from "./api";

interface GetWordsOptions {
  bookId?: string;
  isArchived?: boolean;
  masteryLevel?: number;
  search?: string;
}

/**
 * wordsService Notes
 *
 * 1) Error Handling
 * - apiClient returns obj with data or error; doesn't throw on failure
 * - crucial since RQ expects promise to reject (throw) when something goes wrong
 */
export const wordsService = {
  async getAllWords(options: GetWordsOptions = {}): Promise<SavedWordRow[]> {
    const params = new URLSearchParams();

    if (options.bookId) params.append("library_book_id", options.bookId);
    if (options.isArchived !== undefined)
      params.append("is_archived", String(options.isArchived));
    if (options.masteryLevel !== undefined)
      params.append("mastery_level", String(options.masteryLevel));
    if (options.search) params.append("search", options.search);

    const queryString = params.toString();
    const endpoint = queryString ? `words?${queryString}` : "words";

    const response = await getApiClient().get<SavedWordRow[]>(endpoint);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async getDueWords(): Promise<SavedWordRow[]> {
    const response = await getApiClient().get<SavedWordRow[]>("/words/review");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async getSingleWord(wordId: string): Promise<SavedWordRow> {
    const response = await getApiClient().get<SavedWordRow>(`/words/${wordId}`);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async addNewWord(newWord: CreateWordInput): Promise<SavedWordRow> {
    const response = await getApiClient().post<SavedWordRow>("/words", newWord);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async updateWord(
    wordId: string,
    updateWord: UpdateWordInput,
  ): Promise<SavedWordRow> {
    const response = await getApiClient().put<SavedWordRow>(
      `/words/${wordId}`,
      updateWord,
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async deleteWord(wordId: string): Promise<void> {
    const response = await getApiClient().delete(`/words/${wordId}`);
    if (response.error) throw new Error(response.error);
  },
  async reviewWord(
    wordId: string,
    review: SubmitReviewInput,
  ): Promise<SavedWordRow> {
    const response = await getApiClient().patch<SavedWordRow>(
      `/words/${wordId}/review`,
      review,
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
};
