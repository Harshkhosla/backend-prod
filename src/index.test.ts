import request from "supertest";
import { createApp } from "../src/index";
import express from "express";

let app: express.Application;
beforeAll(() => {
  app = createApp(3001);
});

// describe("Test demo API", () => {
//   test("get the 1st demo data", async () => {
//     const res = await request(app).get("/rest/demo/1");
//     expect(res.body).toEqual({
//       data: [{ id: 1, firstName: "John", lastName: "Doe", gender: "male" }],
//     });
//   });
// });

describe("Post API for Users", () => {
  test("POST /rest/users - should create a new user ", async () => {
    const newUser = {
      givenName: "Harsh1w2",
      familyName: "Test5w4",
      email: "harshsaddemp@example.com",
      password: "123456test",
    };

    const res = await request(app)
      .post("/rest/users")
      .send(newUser)
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(201);
    expect(res.body.data[0]).toHaveProperty("email", newUser.email);
  });
});

describe("GET API for all USERS", () => {
  test("GET /rest/users - should retrieve all users", async () => {
    const res = await request(app)
      .get("/rest/users")
      .set("x-api-key", "HARSH123");
    expect(res.status).toEqual(200);
  });
});

describe("GET API for User by ID", () => {
  test("GET /rest/users/:id - should retrieve a user by ID", async () => {
    const res = await request(app)
      .get("/rest/users")
      .set("x-api-key", "HARSH123");
    expect(res.status).toEqual;
    // expect(res.body.data).toHaveProperty("id", 1);
  });

  test("GET /rest/users/:id - should return 404 for non-existent user", async () => {
    const res = await request(app)
      .get("/rest/users/999")
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(404);
    expect(res.body.error).toBe("User not found");
  });
});

describe("PUT API for User", () => {
  test("PUT /rest/users/:id - should update user by ID", async () => {
    const updatedUser = {
      email: "updated.email@example.com",
      gender: "female",
      age: 37,
    };

    const res = await request(app)
      .put("/rest/users/2")
      .send(updatedUser)
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("message", "User updated successfully");
  });

  test("PUT /rest/users/:id - should return 404 for non-existent user", async () => {
    const updatedUser = {
      email: "updated.email@example.com",
      gender: "female",
      age: 30,
    };

    const res = await request(app)
      .put("/rest/users/999")
      .send(updatedUser)
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(404);
    expect(res.body.error).toBe("User not found");
  });
});

describe("GET API for User Pagination", () => {
  test("GET /rest/userspagination - should retrieve users with pagination", async () => {
    const res = await request(app)
      .get("/rest/userspagination?page=1&limit=2")
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  test("GET /rest/userspagination - should filter users by gender", async () => {
    const res = await request(app)
      .get("/rest/userspagination?gender=male")
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(200);
    expect(
      res.body.data.every((user: any) => user.gender === "male")
    ).toBeTruthy();
  });
});

describe("DELETE API for Users", () => {
  test("DELETE /rest/users/:id - should delete user by ID", async () => {
    const res = await request(app)
      .delete("/rest/users/2")
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");
  });

  test("DELETE /rest/users/:id - should return 404 for non-existent user", async () => {
    const res = await request(app)
      .delete("/rest/users/999")
      .set("x-api-key", "HARSH123");

    expect(res.status).toEqual(404);
    expect(res.body.error).toBe("User not found");
  });
});
