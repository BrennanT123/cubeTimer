// import { PrismaClient } from "../generated/prisma/index.js";
// import dotenv from "dotenv";

// dotenv.config();

// const databaseUrl = process.env.DATABASE_URL;

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: databaseUrl,
//     },
//   },
// });

//deletes all the solves
// await prisma.solves.deleteMany({});

// async function createSolve(time, plusTwo, dnf, dateTime, scramble, sessionId) {
//   return await prisma.solves.create({
//     data: {
//       time: parseFloat(time),
//       plusTwo,
//       dnf,
//       dateTime,
//       scramble,
//       sessionId,
//     },
//   });
// }

function createScramble() {
  let scramble = "";
  for (let i = 0; i < 16; i++) {
    const numTurn = Math.floor(Math.random() * 6);
    const numDirection = Math.round(Math.random());
    let currentTurn;
    switch (numTurn) {
      case 0:
        currentTurn = `F`;
        break;
      case 1:
        currentTurn = `B`;
        break;
      case 2:
        currentTurn = `D`;
        break;
      case 3:
        currentTurn = `U`;
        break;
      case 4:
        currentTurn = `L`;
        break;
      case 5:
        currentTurn = `R`;
        break;
    }
    switch (numDirection) {
      case 0:
        currentTurn = currentTurn + ` `;
        break;
      case 1:
        currentTurn = currentTurn + `' `;
    }
    scramble = scramble + currentTurn;
  }
  return scramble;
}
export default async function seedData(tx, totalRecords, sessionId) {
  const now = new Date();
  let baseTime = new Date(now.getTime() - (totalRecords - 1) * 30 * 1000);

  const rows = [];
  for (let i = 0; i < totalRecords; i++) {
    const ideal = 15 + 75 * Math.exp(-i / (totalRecords / 5));
    const noise = (Math.random() - 0.5) * 10;
    const time = Math.max(ideal + noise, 10);

    rows.push({
      time: parseFloat(time.toFixed(2)),
      plusTwo: Math.random() > 0.9,
      dnf: Math.random() > 0.95,
      dateTime: baseTime,
      scramble: createScramble(),
      sessionId,
    });

    baseTime = new Date(baseTime.getTime() + 30 * 1000);
  }


  const { count } = await tx.solves.createMany({ data: rows });
  return count;
}