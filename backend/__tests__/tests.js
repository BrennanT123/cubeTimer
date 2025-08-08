import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/index.js";
dotenv.config();

describe("CRUD new time", () => {
  const agent = request.agent(app);// presis session cookies across tests
  let timeId;
  test("should see that the session does not exist then seed the data", async () =>
  {
    const res = await agent.get("/dataRouter/checkSession");
    if (res.statusCode !== 200)
    {
        console.error(res.error);
    }
    expect(res.body.sessionExists).toBe(false);
  });
  test("should see that the session exists then return", async () =>
  {
    const res = await agent.get("/dataRouter/checkSession");
    if (res.statusCode !== 200)
    {
        console.error(res.error);
    }
    expect(res.body.sessionExists).toBe(true);
  });


  test("Should add new time", async () => {
    const res = await agent
      .post("/dataRouter/postNewTime")
      .send({
        time: (Math.random() * 5 + 15).toFixed(2),
        scramble: `B L L' F' L U' U R' D' U' L L' R' U F R'`,
      });
    if (res.statusCode !== 201) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(201);
    timeId = res.body.newTime.id;
  });
  test("Should get the time by ID", async () => {
    const res = await agent.get(`/dataRouter/getTime/${timeId}`);
    if (res.statusCode !== 200) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
  });
  test("should make the time a plus two", async () => {
    const res = await agent.put(`/dataRouter/putPlusTwo/${timeId}`);
    if (res.statusCode !== 200) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body.solve).toHaveProperty("plusTwo", true);
  });
  test("should make the time a dnf ", async () => {
    const res = await agent.put(`/dataRouter/putDnf/${timeId}`);
    if (res.statusCode !== 200) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body.solve).toHaveProperty("dnf", true);
  });
  test("Should delete the time by ID", async () => {
    const res = await agent.delete(`/dataRouter/deleteTime/${timeId}`);
    if (res.statusCode !== 204) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(204);
  });

  test("Should get the last 5 solves", async () => {
    const res = await agent
      .get("/dataRouter/getHistory")
      .query({ numSolves: 5 });
    if (res.statusCode !== 204) {
      console.error(res.error);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body.recentSolves.length).toBe(5);
  });
});
