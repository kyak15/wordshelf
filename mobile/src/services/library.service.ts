import { LibraryBook } from "../types";
import { apiClient } from "./api";

export const libraryService = {
  async getBooks(): Promise<LibraryBook[]> {
    const response = await apiClient.get<LibraryBook[]>("/library");
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

  async addBook(bookData: {
    title: string;
    author: string;
  }): Promise<LibraryBook> {
    const response = await apiClient.post<LibraryBook>("/library", bookData);
    if (response.error) throw new Error(response.error);
    return response.data!;
  },

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
