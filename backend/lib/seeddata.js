import { PrismaClient } from "../generated/prisma/index.js";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function createSolve(time,plusTwo,dnf,dateTime) {
  return await prisma.solves.create({
    data: {
       time: parseFloat(time),
       plusTwo,
       dnf,
       dateTime
    },
  });
}

  const totalRecords = 100;
  const now = new Date();

  //calculate the start date: (100(total records) - 1) * 30s = 2970s = 49.5 min ago
  let baseTime = new Date(now.getTime() - (totalRecords - 1) * 30 * 1000);

for (let i = 0; i < totalRecords; i++) {
  createSolve((Math.random() * 5 + 15).toFixed(2), Math.random() > .9, Math.random() >.95, baseTime);
  baseTime = new Date(baseTime.getTime() + 30 * 1000);

}
