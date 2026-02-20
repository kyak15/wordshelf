import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { libraryService } from "../services/library.service";

export async function getAllBooksController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const books = await libraryService.getAllBooks(req.user.user_id);
    res.json(books);
  } catch (error) {
    console.error("Error fetching library books:", error);
    res.status(500).json({ error: "Failed to fetch library books" });
  }
}

export async function getBookByIdController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;
    const book = await libraryService.getBookById(req.user.user_id, id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
}

export async function addNewBookController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const newBook = req.body.book;
    if (!newBook || !newBook.title || !newBook.language_code) {
      res
        .status(400)
        .json({ error: "Missing required book fields (title, language_code)" });
      return;
    }
    const libraryBook = await libraryService.addNewBook(
      req.user.user_id,
      newBook
    );
    res.status(201).json(libraryBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
}

export async function getWordsFromBookController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;
    const words = await libraryService.getWordsFromBook(req.user.user_id, id);
    res.json(words);
  } catch (error) {
    console.error("Error getting words from book:", error);
    res.status(500).json({ error: "Failed to fetch words from book" });
  }
}

export async function updateBookController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;
    const { status, current_page, is_favorite } = req.body;

    const updated = await libraryService.updateBook(req.user.user_id, id, {
      status,
      current_page,
      is_favorite,
    });

    if (!updated) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    // Check if a book was auto-promoted to "reading"
    let promotedBook = null;
    if (status === "finished" || status === "planned") {
      promotedBook = await libraryService.getPromotedBook(req.user.user_id);
    }

    res.json({
      book: updated,
      promotedBook: promotedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
}

export async function deleteBookController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const { id } = req.params;

    const deleted = await libraryService.deleteBook(req.user.user_id, id);

    if (!deleted) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
}
