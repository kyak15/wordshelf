import { apiClient } from "./api";

export const libraryService = {
  // Get all books in user's library
  async getBooks(): Promise<LibraryBook[]> {
    const response = await apiClient.get<LibraryBook[]>("/library");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  // Add a book to library
  async addBook(bookData: {
    title: string;
    author: string;
  }): Promise<LibraryBook> {
    const response = await apiClient.post<LibraryBook>("/library", bookData);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  // Update reading status
  async updateStatus(
    libraryBookId: string,
    status: string
  ): Promise<LibraryBook> {
    const response = await apiClient.post<LibraryBook>(
      `/library/${libraryBookId}/status`,
      { status }
    );
    if (response.error) throw new Error(response.error);
    return response.data!;
  },
};
