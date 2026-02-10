import { CreateWordInput, SavedWord, UpdateWordInput, Word } from "../types";
import { apiClient } from "./api";

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
  async getAllWords(options: GetWordsOptions = {}): Promise<Word[]> {
    const params = new URLSearchParams();

    if (options.bookId) params.append("library_book_id", options.bookId);
    if (options.isArchived !== undefined)
      params.append("is_archived", String(options.isArchived));
    if (options.masteryLevel)
      params.append("mastery_level", options.masteryLevel);
    if (options.search) params.append("search", options.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/words?${queryString}` : "/words";

    const response = await apiClient.get<Word[]>(endpoint);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async getDueWords() {
    const response = await apiClient.get("/words/review");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async getSingleWord(wordId: string) {
    const response = await apiClient.get<SavedWord>(`/words/${wordId}`);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async addNewWord(newWord: CreateWordInput) {
    const response = await apiClient.post("/words", newWord);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async updateWord(wordId: string, updateWord: UpdateWordInput) {
    const response = await apiClient.put(`/word/${wordId}`, updateWord);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  async deleteWord(wordId: string) {
    const response = await apiClient.delete(`/word/${wordId}`);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  //TODO: Need to update API service on flashcard review and update
};
