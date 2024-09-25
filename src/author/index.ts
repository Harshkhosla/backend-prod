import express from "express";
const router = express.Router();
import knex from "../db";
const authorBooksTable = "author_books";
const userTable = "users";
const bookTable = "books";
import { apiKeyMiddleware } from "../middleware/authMiddleware";
import { logMiddleware } from "../middleware/logMiddleware";

router.use(apiKeyMiddleware);
router.use(logMiddleware);
/**
 * @openapi
 * /author/author_books:
 *   post:
 *     summary: Add a new author-book relationship
 *     description: Create a relationship between an author and a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author_id
 *               - book_id
 *             properties:
 *               author_id:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relationship created successfully
 */

router.post("/author_books", async (req, res) => {
  const { author_id, book_id } = req.body;

  try {
    const result = await knex(authorBooksTable)
      .insert({
        author_id,
        book_id,
      })
      .returning("*");
    return res.status(201).json({ data: result });
  } catch {
    return res
      .status(500)
      .json({ error: "Error adding author-book relationship" });
  }
});

/**
 * @openapi
 * /author/author_books/author/{author_id}/books:
 *   get:
 *     summary: Get all books by a specific author
 *     description: Retrieve all books authored or co-authored by a specific author
 *     parameters:
 *       - name: author_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *       404:
 *         description: No books found for this author
 */
router.get("/author_books/author/:author_id/books", async (req, res) => {
  const author_id = req.params;

  try {
    const authorBooks = await knex(authorBooksTable).where({ author_id });
    console.log(authorBooks, "sddsdssd");

    if (authorBooks.length === 0) {
      return res.status(404).json({ error: "No books found for this author" });
    }

    const bookIds = authorBooks.map((ab) => ab.book_id);
    const books = await knex(bookTable).whereIn("id", bookIds);

    // const result = bookTable.filter((book) => booksId.includes(book.id));
    return res.status(200).json({ data: books });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
