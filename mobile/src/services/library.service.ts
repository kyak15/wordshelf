import { LibraryBookWithDetails, SavedWordRow, ReadingStatus } from "../types";
import { apiClient } from "./api";

export const libraryService = {
  async getBooks(): Promise<LibraryBookWithDetails[]> {
    const response = await apiClient.get<LibraryBookWithDetails[]>(
      "/library/library"
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getBook(libraryBookId: string): Promise<LibraryBookWithDetails> {
    const response = await apiClient.get<LibraryBookWithDetails>(
      `/library/library/${libraryBookId}`
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async addBook(bookData: {
    title: string;
    author?: string;
    isbn13?: string;
    cover_image_url?: string;
    language_code?: string;
  }): Promise<LibraryBookWithDetails> {
    const response = await apiClient.post<LibraryBookWithDetails>(
      "/library/library",
      bookData
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getBookWords(libraryBookId: string): Promise<SavedWordRow[]> {
    const response = await apiClient.get<SavedWordRow[]>(
      `/library/library/${libraryBookId}/words`
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async updateStatus(
    libraryBookId: string,
    status: ReadingStatus
  ): Promise<LibraryBookWithDetails> {
    const response = await apiClient.post<LibraryBookWithDetails>(
      `/library/library/${libraryBookId}/status`,
      { status }
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
};
