import { LibraryBookWithDetails, SavedWordRow, ReadingStatus } from "../types";
import { getApiClient } from "./api";

export const libraryService = {
  async getBooks(): Promise<LibraryBookWithDetails[]> {
    const response = await getApiClient().get<LibraryBookWithDetails[]>("library");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getBook(libraryBookId: string): Promise<LibraryBookWithDetails> {
    const response = await getApiClient().get<LibraryBookWithDetails>(
      `library/${libraryBookId}`,
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async addBook(bookData: {
    title: string;
    author?: string;
    isbn13?: string;
    cover_image_url?: string;
    language_code: string;
  }): Promise<LibraryBookWithDetails> {
    // Backend expects { book: { ... } } structure
    //TODO: API Mis-Mappings due to endpoint parameter
    const response = await getApiClient().post<LibraryBookWithDetails>("library", {
      book: bookData,
    });
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async getBookWords(libraryBookId: string): Promise<SavedWordRow[]> {
    const response = await getApiClient().get<SavedWordRow[]>(
      `library/${libraryBookId}/words`,
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async updateStatus(
    libraryBookId: string,
    status: ReadingStatus,
  ): Promise<LibraryBookWithDetails> {
    const response = await getApiClient().post<LibraryBookWithDetails>(
      `/library/library/${libraryBookId}/status`,
      { status },
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async updateBook(
    libraryBookId: string,
    updates: {
      status?: string;
      current_page?: number;
      is_favorite?: boolean;
    },
  ): Promise<LibraryBookWithDetails> {
    const response = await getApiClient().put<LibraryBookWithDetails>(
      `library/${libraryBookId}`,
      updates,
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async deleteBook(libraryBookId: string): Promise<void> {
    const response = await getApiClient().delete(`library/${libraryBookId}`);
    if (response.error) throw new Error(response.error);
  },
};
