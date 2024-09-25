import { Knex } from "knex";

const userTable = "users";
const bookTable = "books";
const authorBooksTable = "author_books";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(userTable);
  await knex.schema.dropTableIfExists(bookTable);
  await knex.schema.dropTableIfExists(authorBooksTable);

  await knex.schema.createTable(userTable, (table) => {
    table.increments("id").primary();
    table.string("firstName");
    table.string("lastName");
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("gender");
    table.integer("age");
  });

  await knex.schema.createTable(bookTable, (table) => {
    table.increments("id").primary();
    table.string("title");
    table.string("summary");
  });

  await knex.schema.createTable(authorBooksTable, (table) => {
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

  // Insert initial data
  await knex(userTable).insert([
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

  await knex(bookTable).insert([
    { id: 1, title: "Book 1", summary: "Summary 1" },
    { id: 2, title: "Book 2", summary: "Summary 2" },
    { id: 3, title: "Book 3", summary: "Summary 3" },
    { id: 4, title: "Book 4", summary: "Summary 4" },
    { id: 5, title: "Book 5", summary: "Summary 5" },
  ]);

  await knex(authorBooksTable).insert([
    { author_id: 1, book_id: 1 },
    { author_id: 2, book_id: 2 },
    { author_id: 1, book_id: 2 },
    { author_id: 1, book_id: 3 },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(userTable);
  await knex.schema.dropTableIfExists(bookTable);
  await knex.schema.dropTableIfExists(authorBooksTable);
}
