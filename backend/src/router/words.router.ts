import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getAllWordsController,
  getDueWordsController,
  getSingleWordController,
  addNewWordController,
  updateWordController,
  deleteWordController,
  updateFlashcardReviewController,
} from "../controller/words.controller";

export const wordsRouter = Router();

wordsRouter.use(requireAuth);

wordsRouter.get("/", getAllWordsController); // list all words (with filters)
wordsRouter.get("/review", getDueWordsController); // get words due for flashcard review
wordsRouter.get("/:id", getSingleWordController); // get a single word's details
wordsRouter.post("/", addNewWordController); // add a new word
wordsRouter.patch("/:id", updateWordController); // edit a word
wordsRouter.delete("/:id", deleteWordController); // delete a word
wordsRouter.patch("/:id/review", updateFlashcardReviewController); // submit flashcard review result
