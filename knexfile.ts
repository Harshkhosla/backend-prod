import path from "path";

export default {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "data", "db.sqlite"), // Path to SQLite database file
  },
  migrations: {
    directory: "./migrations", // Path to migrations directory
  },
  useNullAsDefault: true, // Needed for SQLite
};
