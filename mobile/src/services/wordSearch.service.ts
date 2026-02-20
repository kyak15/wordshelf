import { DictionaryApiResponse } from "../types";

const DICTIONARY_API_URL = process.env.EXPO_PUBLIC_DICTIONARY_API_URL;

export const wordSearchService = {
  async searchWord(query: string): Promise<DictionaryApiResponse | null> {
    if (!query.trim()) {
      return null;
    }

    const response = await fetch(
      `${DICTIONARY_API_URL}/${query.trim().toLowerCase()}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Word not found
      }
      throw new Error(`Word search failed: ${response.status}`);
    }

    const data: DictionaryApiResponse[] = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    // Return the first result
    return data[0];
  },
};
