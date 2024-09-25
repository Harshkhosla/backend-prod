import express from "express";
const router = express.Router();
import knex from "../db";
import bcrypt from "bcrypt";
const userTable = "users";
/**
 * @openapi
 * /rest/demo/{id}:
 *   get:
 *     description: demo get endpoint!
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns the record.
 *       404:
 *         description: Not found.
 */
router.get("/demo/:id", async (req, res) => {
  const { id } = req.params;
  if (id !== "1") {
    return res.status(404).json({ error: "Not found" });
  }
  const data = await knex(userTable).select().where({ id });
  return res.json({ data });
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user with first name, last name, email, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/users", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // console.log(req.body);

  // Validate that required fields are present
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ error: "firstName, lastName, email, and password are required" });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await knex("users")
      .insert({
        firstName,
        lastName,
        email,
        password: hashedPassword, // Save the hashed password
      })
      .returning("*");

    console.log(result);
    // Return the created user with a 201 status
    return res.status(201).json({ data: result });
  } catch (err) {
    // Handle errors, such as if the email is not unique
    if (err.code === "23505") {
      // Unique violation for email
      return res.status(400).json({ error: "Email must be unique" });
    }
    return res.status(500).json({ error: "Error creating user" });
  }
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Get a user record from the users table using their ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found successfully
 *       404:
 *         description: User not found
 */
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await knex(userTable).where({ id }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving user" });
  }
});

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get all users from the users table
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Error retrieving users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await knex(userTable).select();

    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving users" });
  }
});

router.get("/", (_req, res) => {
  return res.json({ data: "Rest API page!" });
});

export default router;
