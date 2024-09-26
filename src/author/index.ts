import express from "express";
const router = express.Router();
import knex from "../db";
const authorBooksTable = "author_books";
const userTable = "users";
const bookTable = "books";
import { apiKeyMiddleware } from "../middleware/authMiddleware";
import { logMiddleware } from "../middleware/logMiddleware";

// This is the api for the author and the books that have the relationship and
// furthermore i have also workded with prisma a an orm so i can alo use that

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
  const { author_id } = req.params;
  console.log(author_id);

  try {
    const authorBooks = await knex(authorBooksTable)
      .where({ author_id })
      .select("*");

    console.log("Author Books:", authorBooks);

    if (authorBooks.length === 0) {
      return res.status(404).json({ error: "No books found for this author" });
    }

    const bookIds = authorBooks.map((ab) => ab.book_id);
    const books = await knex(bookTable).whereIn("id", bookIds).select("*");

    // const result = bookTable.filter((book) => booksId.includes(book.id));
    return res.status(200).json({ data: books });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /author/author_books/book/{book_id}/authors:
 *   get:
 *     summary: Get all authors and co-authors of a specific book
 *     description: Retrieve all authors who have authored or co-authored a specific book
 *     parameters:
 *       - name: book_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Authors retrieved successfully
 *       404:
 *         description: No authors found for this book
 */

router.get("/author_books/book/:book_id/authors", async (req, res) => {
  const { book_id } = req.params;
  try {
    const authors = await knex(authorBooksTable).where({ book_id }).select("*");

    console.log(authors);

    if (authors.length === 0) {
      return res.status(404).json({ error: "No authors found" });
    }
    const author_id = authors.map((ab) => ab.author_id);
    const authors_details = await knex(userTable)
      .whereIn("id", author_id)
      .select("*");
    return res.status(200).json({ data: authors_details });
  } catch {
    return res.status(500).json({ error: "No author for this book " });
  }
});

export default router;
