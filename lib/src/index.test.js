var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from "supertest";
import { createApp } from "../src/index";
let app;
beforeAll(() => {
    app = createApp(3001);
});
describe("Post API for Users", () => {
    test("POST /rest/users - should create a new user ", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            givenName: "Harsh1w2",
            familyName: "Test5w4",
            email: "harshsaddemp@example.com",
            password: "123456test",
        };
        const res = yield request(app)
            .post("/rest/users")
            .send(newUser)
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(201);
        expect(res.body.data[0]).toHaveProperty("email", newUser.email);
    }));
});
describe("GET API for all USERS", () => {
    test("GET /rest/users - should retrieve all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .get("/rest/users")
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(200);
    }));
});
describe("GET API for User by ID", () => {
    test("GET /rest/users/:id - should retrieve a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .get("/rest/users")
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual;
    }));
    test("GET /rest/users/:id - should return 404 for non-existent user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .get("/rest/users/999")
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(404);
        expect(res.body.error).toBe("User not found");
    }));
});
describe("PUT API for User", () => {
    test("PUT /rest/users/:id - should update user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = {
            email: "updated.email@example.com",
            gender: "female",
            age: 37,
        };
        const res = yield request(app)
            .put("/rest/users/2")
            .send(updatedUser)
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("message", "User updated successfully");
    }));
    test("PUT /rest/users/:id - should return 404 for non-existent user", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = {
            email: "updated.email@example.com",
            gender: "female",
            age: 30,
        };
        const res = yield request(app)
            .put("/rest/users/999")
            .send(updatedUser)
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(404);
        expect(res.body.error).toBe("User not found");
    }));
});
describe("GET API for User Pagination", () => {
    test("GET /rest/userspagination - should retrieve users with pagination", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .get("/rest/userspagination?page=1&limit=2")
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
        expect(res.body.data.length).toBeLessThanOrEqual(2);
    }));
    test("GET /rest/userspagination - should filter users by gender", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .get("/rest/userspagination?gender=male")
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(200);
        expect(res.body.data.every((user) => user.gender === "male")).toBeTruthy();
    }));
});
describe("DELETE API for Users", () => {
    test("DELETE /rest/users/:id - should delete user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .delete("/rest/users/2")
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("message", "User deleted successfully");
    }));
    test("DELETE /rest/users/:id - should return 404 for non-existent user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .delete("/rest/users/999")
            .set("x-api-key", "HARSH123");
        expect(res.status).toEqual(404);
        expect(res.body.error).toBe("User not found");
    }));
});
//# sourceMappingURL=index.test.js.map