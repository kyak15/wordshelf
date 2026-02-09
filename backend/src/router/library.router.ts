import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  addNewBookController,
  getAllBooksController,
  getBookByIdController,
} from "../controller/library.controller";

export const libraryRouter = Router();

libraryRouter.use(requireAuth);
libraryRouter.get("/", getAllBooksController);
libraryRouter.post("/", addNewBookController);
libraryRouter.get("/:id", getBookByIdController);
