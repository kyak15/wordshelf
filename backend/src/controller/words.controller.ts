import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { wordsService } from "../services/words.service";

export async function getAllWordsController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { library_book_id, is_archived, mastery_level, search } = req.query;
    const words = await wordsService.getAllWords(req.user.user_id, {
      library_book_id: library_book_id as string | undefined,
      is_archived:
        is_archived !== undefined ? is_archived === "true" : undefined,
      mastery_level:
        mastery_level !== undefined ? Number(mastery_level) : undefined,
      search: search as string | undefined,
    });
    res.json(words);
  } catch (error) {
    console.error("Error fetching words:", error);
    res.status(500).json({ error: "Failed to fetch words" });
  }
}

export async function getDueWordsController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const dueWords = await wordsService.getDueWords(req.user.user_id);
    res.json(dueWords);
  } catch (error) {
    console.error("Error fetching due words:", error);
    res.status(500).json({ error: "Failed to fetch due words" });
  }
}

export async function getSingleWordController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;
    const word = await wordsService.getWordById(req.user.user_id, id);
    if (!word) {
      res.status(404).json({ error: "Word not found" });
      return;
    }
    res.json(word);
  } catch (error) {
    console.error("Error fetching word:", error);
    res.status(500).json({ error: "Failed to fetch word" });
  }
}

export async function addNewWordController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const {
      library_book_id,
      text,
      language_code,
      chosen_sense_id,
      page_number,
      chapter,
      context_snippet,
      saved_definition,
      saved_part_of_speech,
      saved_example,
      saved_audio_url,
    } = req.body;

    if (!library_book_id || !text) {
      res
        .status(400)
        .json({ error: "Missing required fields (library_book_id, text)" });
      return;
    }

    const newWord = await wordsService.addWord(req.user.user_id, {
      library_book_id,
      text,
      language_code,
      chosen_sense_id,
      page_number,
      chapter,
      context_snippet,
      saved_definition,
      saved_part_of_speech,
      saved_example,
      saved_audio_url,
    });
    res.status(201).json(newWord);
  } catch (error) {
    console.error("Error adding word:", error);
    res.status(500).json({ error: "Failed to add word" });
  }
}

export async function updateWordController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;
    const {
      chosen_sense_id,
      page_number,
      chapter,
      context_snippet,
      is_archived,
      saved_definition,
      saved_part_of_speech,
      saved_example,
      saved_audio_url,
    } = req.body;

    const updated = await wordsService.updateWord(req.user.user_id, id, {
      chosen_sense_id,
      page_number,
      chapter,
      context_snippet,
      is_archived,
      saved_definition,
      saved_part_of_speech,
      saved_example,
      saved_audio_url,
    });
    if (!updated) {
      res.status(404).json({ error: "Word not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ error: "Failed to update word" });
  }
}

export async function deleteWordController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;
    const deleted = await wordsService.deleteWord(req.user.user_id, id);
    if (!deleted) {
      res.status(404).json({ error: "Word not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ error: "Failed to delete word" });
  }
}

export async function updateFlashcardReviewController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;
    const { quality } = req.body;

    if (typeof quality !== "number" || quality < 0 || quality > 5) {
      res
        .status(400)
        .json({ error: "quality must be a number between 0 and 5" });
      return;
    }

    const reviewed = await wordsService.submitReview(
      req.user.user_id,
      id,
      quality
    );
    if (!reviewed) {
      res.status(404).json({ error: "Word not found" });
      return;
    }
    res.json(reviewed);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
}
