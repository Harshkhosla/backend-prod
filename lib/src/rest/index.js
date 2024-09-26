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
import bcrypt from "bcrypt";
const userTable = "users";
import { apiKeyMiddleware } from "../middleware/authMiddleware";
import { logMiddleware } from "../middleware/logMiddleware";
import { userSchema } from "../types/index";
router.use(apiKeyMiddleware);
router.use(logMiddleware);
router.get("/demo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id !== "1") {
        return res.status(404).json({ error: "Not found" });
    }
    const data = yield knex(userTable).select().where({ id });
    return res.json({ data });
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = userSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            error: "Validation error",
            details: parseResult.error.errors,
        });
    }
    const { givenName, familyName, firstName, lastName, email, password } = req.body;
    const userFirstName = givenName || firstName;
    const userLastName = familyName || lastName;
    try {
        const hashedPassword = yield bcrypt.hash(password, 10);
        const result = yield knex("users")
            .insert({
            firstName: userFirstName,
            lastName: userLastName,
            email,
            password: hashedPassword,
        })
            .returning("*");
        console.log("Inserted User: ", result);
        return res.status(201).json({ data: result });
    }
    catch (err) {
        if (err.code === "23505") {
            console.error("Unique Email Error: ", err);
            return res.status(400).json({ error: "Email must be unique" });
        }
        console.error("Database Error: ", err);
        return res.status(500).json({ error: "Error creating user" });
    }
}));
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield knex(userTable).where({ id }).first();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ data: user });
    }
    catch (err) {
        return res.status(500).json({ error: "Error retrieving user" });
    }
}));
router.get("/users", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield knex(userTable).select();
        return res.status(200).json({ data: users });
    }
    catch (err) {
        return res.status(500).json({ error: "Error retrieving users" });
    }
}));
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email, gender, age } = req.body;
    try {
        const updatedUser = yield knex(userTable).where({ id }).update({
            email,
            gender,
            age,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Error updating user" });
    }
}));
router.get("/userspagination", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, gender, age } = req.query;
    try {
        let query = knex(userTable).select();
        if (gender)
            query.where("gender", gender);
        if (age)
            query.where("age", age);
        const users = yield query
            .limit(Number(limit))
            .offset((Number(page) - 1) * Number(limit));
        return res.status(200).json({ data: users });
    }
    catch (err) {
        return res.status(500).json({ error: "Error retrieving users" });
    }
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedRows = yield knex(userTable).where({ id }).del();
        if (deletedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Error deleting user" });
    }
}));
router.get("/", (_req, res) => {
    return res.json({ data: "Rest API page!" });
});
export default router;
//# sourceMappingURL=index.js.map