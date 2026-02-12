import { DictionaryApiResponse } from "../types";

function transformWord(word: DictionaryApiResponse) {
  const audio = word.phonetics?.map((phone) => phone.audio);

  return {
    word: word.word,
    phonetic: word.phonetic,
    audio: audio,
    meanings: word.meanings,
  };
}

export const wordSearchService = {
  /**
   * Search for books using Google Books API
   * @param query - Search query (title or author)
   * @param maxResults - Maximum number of results (default 10)
   */
  async searchWords(
    query: string,
    maxResults: number = 10
  ): Promise<DictionaryApiResponse[]> {
    if (!query.trim()) {
      return [];
    }

    const response = await fetch(`${process.env.DICTIONARY_URL}/${query}`);

    if (!response.ok) {
      throw new Error(`Book search failed: ${response.status}`);
    }

    const data: DictionaryApiResponse[] = await response.json();

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(transformWord);
  },
};
