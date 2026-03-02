import {
  GoogleBookResult,
  GoogleBooksSearchResponse,
  GoogleBooksVolume,
} from "../types";
import { getGoogleBooksApiKey, GOOGLE_BOOKS_API_URL } from "../config/api";

function transformVolume(volume: GoogleBooksVolume): GoogleBookResult {
  const { volumeInfo } = volume;

  const isbn13 =
    volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")
      ?.identifier ?? null;

  let coverUrl =
    volumeInfo.imageLinks?.thumbnail ??
    volumeInfo.imageLinks?.smallThumbnail ??
    null;

  if (coverUrl) {
    coverUrl = coverUrl.replace("http://", "https://");
  }

  return {
    id: volume.id,
    title: volumeInfo.title,
    authors: volumeInfo.authors ?? [],
    coverUrl,
    isbn13,
    language: volumeInfo.language ?? "en",
  };
}

export const bookSearchService = {
  /**
   * Search for books using Google Books API
   * @param query - Search query (title or author)
   * @param maxResults - Maximum number of results (default 10)
   */
  async searchBooks(
    query: string,
    maxResults: number = 10,
  ): Promise<GoogleBookResult[]> {
    if (!query.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      q: query,
      maxResults: String(maxResults),
      printType: "books", // Only return books
    });
    const key = getGoogleBooksApiKey();
    if (key) params.set("key", key);

    const response = await fetch(`${GOOGLE_BOOKS_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Book search failed: ${response.status}`);
    }

    const data: GoogleBooksSearchResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map(transformVolume);
  },
};
