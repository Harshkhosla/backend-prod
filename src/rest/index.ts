import express from "express";
const router = express.Router();
import knex from "../db";
import bcrypt from "bcrypt";
const userTable = "users";
import { apiKeyMiddleware } from "../middleware/authMiddleware";
import { logMiddleware } from "../middleware/logMiddleware";
import { userSchema,UserupdateSchema } from "../types/index";

router.use(apiKeyMiddleware);
router.use(logMiddleware);

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

// I have changed  the schema of the users as i have added the password
// as a extra field and did alos implemented the hashing of the password
// before storing it and have added all the test cases in the test file
// and checked them before


/**
 * @openapi
 * /rest/users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user with first name, last name, email, and password
 *     security:
 *       - ApiKeyAuth: []
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/users", async (req, res) => {
  // console.log("Incoming Request Body: ", req.body);
  const parseResult = userSchema.safeParse(req.body);

  if (!parseResult.success) {
    // console.error("Validation Errors: ", parseResult);
    return res.status(400).json({
      error: "Validation error",
      details: parseResult.error.errors,
    });
  }

  const { givenName, familyName, firstName, lastName, email, password } =
  parseResult.data;

  const userFirstName = givenName || firstName;
  const userLastName = familyName || lastName;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await knex("users")
      .insert({
        firstName: userFirstName,
        lastName: userLastName,
        email,
        password: hashedPassword,
      })
      .returning("*");

    console.log("Inserted User: ", result);

    return res.status(201).json({ data: result });
  } catch (err) {
    if (err.code === "23505") {
      console.error("Unique Email Error: ", err);
      return res.status(400).json({ error: "Email must be unique" });
    }
    console.error("Database Error: ", err);
    return res.status(500).json({ error: "Error creating user" });
  }
});

/**
 * @openapi
 * /rest/users/{id}:
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
 * /rest/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get all users from the users table
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Error retrieving users
 */
router.get("/users", async (_req, res) => {
  
  try {
    const users = await knex(userTable).select();

    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }


    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving users" });
  }
});

/**
 * @openapi
 * /rest/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update user details like email, gender, and age
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
  */
  router.put("/users/:id", async (req, res) => {
    //  console.log("PUT /users/:id route hit"); 
    const { id } = req.params;
    console.log(id);
    
    const parseResult = UserupdateSchema.safeParse(req.body)
    
    if (!parseResult.success) {
      // console.error("Validation Errors: ", parseResult);
      return res.status(400).json({
        error: "Validation error",
        details: parseResult.error.errors,
      });
    }
    const { email, gender, age } = parseResult.data;
    // console.log(email);
    const updateFields: Partial<{ email: string; gender: string; age: number }> = {};
    if (email) updateFields.email = email;
    if (gender) updateFields.gender = gender;
    if (age !== undefined) updateFields.age = age;
    
    try {
      const updatedUser = await knex(userTable).where({ id }).update(
        updateFields
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Error updating user" });
    }
  });

/**
 * @openapi
 * /rest/userspagination:
 *   get:
 *     summary: Retrieve all users with pagination and filters
 *     description: Get all users from the users table, with pagination and optional filtering by gender or age
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: gender
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: age
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Error retrieving users
 */
router.get("/userspagination", async (req, res) => {
  const { page = 1, limit = 10, gender, age } = req.query;

  try {
    let query = knex(userTable).select();

    if (gender) query.where("gender", gender);
    if (age) query.where("age", age);

    const users = await query
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving users" });
  }
});

/**
 * @openapi
 * /rest/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Remove a user from the database using their ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await knex(userTable).where({ id }).del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting user" });
  }
});

router.get("/", (_req, res) => {
  return res.json({ data: "Rest API page!" });
});

export default router;
