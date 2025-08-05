import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/index.js";
dotenv.config();

describe("CRUD new time", () => {
  let timeId;
  test("Should add new time", async () => {
    const res = await request(app)
      .post("/dataRouter/postNewTime")
      .send({
        time: (Math.random() * 5 + 15).toFixed(2),
      });
    if (res.statusCode !== 201) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(201);
    timeId = res.body.newTime.id;
  });
  test("Should get the time by ID", async () => {
    const res = await request(app).get(`/dataRouter/getTime/${timeId}`);
    if (res.statusCode !== 200) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
  });
  test("should make the time a plus two", async () => {
    const res = await request(app).put(`/dataRouter/putPlusTwo/${timeId}`);
    if (res.statusCode !== 200) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body.solve).toHaveProperty("plusTwo", true);
  });
  test("should make the time a dnf ", async () => {
    const res = await request(app).put(`/dataRouter/putDnf/${timeId}`);
    if (res.statusCode !== 200) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body.solve).toHaveProperty("dnf", true);
  });
  test("Should delete the time by ID", async () => {
    const res = await request(app).delete(`/dataRouter/deleteTime/${timeId}`);
    if (res.statusCode !== 204) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(204);
  });

  test("Should get the last 5 solves", async () => {
    const res = await request(app)
      .get("/dataRouter/getHistory")
      .send({ numSolves: 5 });
    if (res.statusCode !== 204) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body.recentSolves.length).toBe(5);
  });
});
