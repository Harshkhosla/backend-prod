// db.ts
import knex from "knex";

// Load Knex configuration from knexfile
import knexConfig from "../knexfile";

// Create Knex instance
const db = knex(knexConfig);

export default db;
