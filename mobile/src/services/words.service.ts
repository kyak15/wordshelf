import { apiClient } from "./api";

interface GetWordsOptions {
  bookId?: string;
  isArchived?: boolean;
  masteryLevel?: number;
  search?: string;
}

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
  async getSingleWord(bookId: string) {
    const response = await apiClient.get<Word>(`/words/${wordId}`);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
  //TODO: Add Post, Patches, and Delete services
};
