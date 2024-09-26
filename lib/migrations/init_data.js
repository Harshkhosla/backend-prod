var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userTable = "users";
const bookTable = "books";
const authorBooksTable = "author_books";
export function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTableIfExists(userTable);
        yield knex.schema.dropTableIfExists(bookTable);
        yield knex.schema.dropTableIfExists(authorBooksTable);
        yield knex.schema.createTable(userTable, (table) => {
            table.increments("id").primary();
            table.string("firstName");
            table.string("lastName");
            table.string("email").notNullable().unique();
            table.string("password").notNullable();
            table.string("gender");
            table.integer("age");
        });
        yield knex.schema.createTable(bookTable, (table) => {
            table.increments("id").primary();
            table.string("title");
            table.string("summary");
        });
        yield knex.schema.createTable(authorBooksTable, (table) => {
            table
                .integer("author_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable(userTable)
                .onDelete("CASCADE");
            table
                .integer("book_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable(bookTable)
                .onDelete("CASCADE");
            table.primary(["author_id", "book_id"]);
        });
        yield knex(userTable).insert([
            {
                id: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "hashedpassword1",
            },
            {
                id: 2,
                firstName: "Jane",
                lastName: "Doe",
                email: "jane.doe@example.com",
                password: "hashedpassword2",
            },
        ]);
        yield knex(bookTable).insert([
            { id: 1, title: "Book 1", summary: "Summary 1" },
            { id: 2, title: "Book 2", summary: "Summary 2" },
            { id: 3, title: "Book 3", summary: "Summary 3" },
            { id: 4, title: "Book 4", summary: "Summary 4" },
            { id: 5, title: "Book 5", summary: "Summary 5" },
        ]);
        yield knex(authorBooksTable).insert([
            { author_id: 1, book_id: 1 },
            { author_id: 2, book_id: 2 },
            { author_id: 1, book_id: 2 },
            { author_id: 1, book_id: 3 },
        ]);
    });
}
export function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTableIfExists(userTable);
        yield knex.schema.dropTableIfExists(bookTable);
        yield knex.schema.dropTableIfExists(authorBooksTable);
    });
}
//# sourceMappingURL=init_data.js.map