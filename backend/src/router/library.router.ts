import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  addNewBookController,
  getAllBooksController,
  getBookByIdController,
  getWordsFromBookController,
  updateBookController,
  deleteBookController,
} from "../controller/library.controller";

export const libraryRouter = Router();

libraryRouter.use(requireAuth);
libraryRouter.get("/", getAllBooksController);
libraryRouter.post("", addNewBookController);
libraryRouter.get("/:id", getBookByIdController);
libraryRouter.put("/:id", updateBookController);
libraryRouter.delete("/:id", deleteBookController);
libraryRouter.get("/:id/words", getWordsFromBookController);
