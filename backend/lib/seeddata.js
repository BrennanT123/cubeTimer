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

await prisma.solves.deleteMany({

})

async function createSolve(time, plusTwo, dnf, dateTime) {
  return await prisma.solves.create({
    data: {
      time: parseFloat(time),
      plusTwo,
      dnf,
      dateTime,
    },
  });
}

const totalRecords = 1000;
const now = new Date();

//calculate the start date: (100(total records) - 1) * 30s = 2970s = 49.5 min ago
let baseTime = new Date(now.getTime() - (totalRecords - 1) * 30 * 1000);

for (let i = 0; i < totalRecords; i++) {
  const ideal = 15 + 75 * Math.exp(-i / (totalRecords/5));
  const noise = (Math.random() - 0.5) * 10; 
  const time = Math.max(ideal + noise, 10).toFixed(2);
  createSolve(time, Math.random() > 0.9, Math.random() > 0.95, baseTime);
  // console.log(time);
  baseTime = new Date(baseTime.getTime() + 30 * 1000);
}
