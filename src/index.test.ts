import request from "supertest";
import { createApp } from "../src/index";
import express from "express";

let app: express.Application;
beforeAll(() => {
  app = createApp(3001);
});

describe("Test demo API", () => {
  test("get the 1st demo data", async () => {
    const res = await request(app).get("/rest/demo/1");
    expect(res.body).toEqual({
      data: [{ id: 1, firstName: "John", lastName: "Doe", gender: "male" }],
    });
  });
});

// Todo: write tests here
