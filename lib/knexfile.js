import path from "path";
export default {
    client: "sqlite3",
    connection: {
        filename: path.resolve(__dirname, "data", "db.sqlite"),
    },
    migrations: {
        directory: "./migrations",
    },
    useNullAsDefault: true,
};
//# sourceMappingURL=knexfile.js.map