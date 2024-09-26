var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.post("/author_books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author_id, book_id } = req.body;
    try {
        const result = yield knex(authorBooksTable)
            .insert({
            author_id,
            book_id,
        })
            .returning("*");
        return res.status(201).json({ data: result });
    }
    catch (_a) {
        return res
            .status(500)
            .json({ error: "Error adding author-book relationship" });
    }
}));
router.get("/author_books/author/:author_id/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author_id } = req.params;
    console.log(author_id);
    try {
        const authorBooks = yield knex(authorBooksTable)
            .where({ author_id })
            .select("*");
        console.log("Author Books:", authorBooks);
        if (authorBooks.length === 0) {
            return res.status(404).json({ error: "No books found for this author" });
        }
        const bookIds = authorBooks.map((ab) => ab.book_id);
        const books = yield knex(bookTable).whereIn("id", bookIds).select("*");
        return res.status(200).json({ data: books });
    }
    catch (_a) {
        return res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/author_books/book/:book_id/authors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id } = req.params;
    try {
        const authors = yield knex(authorBooksTable).where({ book_id }).select("*");
        console.log(authors);
        if (authors.length === 0) {
            return res.status(404).json({ error: "No authors found" });
        }
        const author_id = authors.map((ab) => ab.author_id);
        const authors_details = yield knex(userTable)
            .whereIn("id", author_id)
            .select("*");
        return res.status(200).json({ data: authors_details });
    }
    catch (_a) {
        return res.status(500).json({ error: "No author for this book " });
    }
}));
export default router;
//# sourceMappingURL=index.js.map