import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const postNewTime = async (req, res) => {
  try {
    const time = parseFloat(req.body.time);
    const scramble = req.body.scramble;
    const sessionId = req.sessionID;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10);

    console.log("HERE IS SESSION ID IN POST NEW TIME", req.sessionID);
    const newTime = await prisma.solves.create({
      data: {
        time,
        scramble,
        session: {
          connectOrCreate: {
            where: { id: sessionId },
            create: {
              id: sessionId,
              sid: sessionId,
              id: sessionId,
              sid: sessionId,
              data: "",
              expiresAt,
            },
          },
        },
      },
    });

    return res
      .status(201)
      .json({ msg: "Time added successfully", newTime, sessionId });
  } catch (err) {
    console.error("Error adding new time");
    return res.status(500).json({ err, msg: "Error adding new time" });
  }
};

export const getTime = async (req, res) => {
  try {
    const sessionId = req.sessionID;
    const timeId = req.params.timeId;
    const time = await prisma.solves.findUnique({
      where: { id: timeId, sessionId: sessionId },
    });
    return res.status(200).json({ msg: "Time retrieved successfully", time });
  } catch (error) {
    console.error("Error deleting time");
    return res.status(500).json({ error: "Error deleting time" });
  }
};

export const putPlusTwo = async (req, res) => {
  try {
    const sid = req.sessionID;
    const id = String(req.params.timeId || "").trim();
    // console.log("HERE IS SESSION ID IN PLUS TWO", req.sessionID);
    // console.log("HERE IS TIME ID IN PLUS TWO", req.params.timeId);
  
    const sessionSolveCount = await prisma.solves.count({ where: { sessionId: sid } });

    const byId = await prisma.solves.findUnique({ where: { id } });
    if (!byId) {
      return res.status(404).json({
        error: "Solve not found by id",
        id,
        sid,
        sessionSolveCount, 
      });
    }

    if (byId.sessionId !== sid) {
      return res.status(403).json({
        error: "Solve belongs to different session",
        id,
        sid,
        solveSessionId: byId.sessionId,
        sessionSolveCount,
      });
    }

    const updated = await prisma.solves.update({
      where: { id },
      data: { plusTwo: !byId.plusTwo },
    });

    return res.json({ msg: "ok", solve: updated, sessionSolveCount });
  } catch (e) {
    console.error("Error updating time (+2):", e);
    return res.status(500).json({ msg: "Error updating time", error: e.message });
  }
};


export const putDNF = async (req, res) => {
  try {
    const timeId = req.params.timeId;
    const sessionId = req.sessionID;
    const editedTime = await prisma.solves.findUnique({
      where: { id: timeId, sessionId: sessionId },
    });
    if (!editedTime) {
      return res.status(404).json({ error: "Time not found" });
    }
    const solve = await prisma.solves.update({
      where: {
        id: timeId,
      },
      data: {
        dnf: !editedTime.dnf,
      },
    });
    return res.status(200).json({ msg: "Time updated successfully", solve });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating time", error });
  }
};

export const deleteTime = async (req, res) => {
  try {
    const timeId = req.params.timeId;
    const sessionId = req.sessionID;
    const deletedTime = await prisma.solves.findUnique({
      where: { id: timeId, sessionId: sessionId },
    });

    if (!deletedTime) {
      return res.status(404).json({ error: "Time not found" });
    }

    await prisma.solves.delete({
      where: {
        id: timeId,
      },
    });
    return res.status(204).json({ msg: "Time deleted successfully" });
  } catch (error) {
    console.error("Error deleting time");
    return res.status(500).json({ error: "Error deleting time" });
  }
};
import seedData from "../lib/seeddata.js";
export const checkSessionExists = async (req, res) => {
  try {
    const sessionId = req.sessionID;

    await prisma.$transaction(async (tx) => {
      await tx.session.upsert({
        where: { id: sessionId },
        update: {},
        create: {
          id: sessionId,
          sid: sessionId,
          data: "",
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
        },
      });

      const already = await tx.solves.count({ where: { sessionId } });
      if (already === 0) {
        await seedData(tx, 1000, sessionId);
      }
    });

    
    req.session.initialized = true;
    await new Promise((resolve, reject) =>
      req.session.save(err => (err ? reject(err) : resolve()))
    );

    return res.status(200).json({ sessionExists: true, seeded: true });
  } catch (error) {
    console.error("Error checking session", error);
    return res.status(500).json({ error: error.message, msg: "Error checking session" });
  }
};


//gets the most recent solves. Num of solves is determined by req.body.numSolves
export const getHistory = async (req, res) => {
  try {
    const sessionId = req.sessionID;
    const { numSolves } = req.query;

    const queryOptions = {
      where: {
        sessionId: sessionId,
      },
      orderBy: {
        dateTime: "desc",
      },
    };
    if (numSolves && numSolves !== "all") {
      queryOptions.take = parseInt(numSolves);
    }

    const recentSolves = await prisma.solves.findMany(queryOptions);

    return res
      .status(200)
      .json({ msg: "Times retrieved successfully", recentSolves });
  } catch (error) {
    console.error("Error getting history");
    return res.status(500).json({ error, msg: "Error getting history " });
  }
};

export const getNumSolves = async (req, res) => {
  try {
    const sessionId = req.sessionID;
    const solveCount = await prisma.solves.count();
    const dnfCount = await prisma.solves.count({
      where: {
        dnf: true,
        sessionId: sessionId,
      },
    });
    const p2Count = await prisma.solves.count({
      where: {
        plusTwo: true,
        sessionId: sessionId,
      },
    });
    return res.status(200).json({
      msg: "Count retrieved successfully",
      solveCount,
      dnfCount,
      p2Count,
    });
  } catch (error) {
    console.error("Error getting history");
    return res.status(500).json({ error, msg: "Error getting history " });
  }
};

//for resetting all solves
export const deleteAllSolves = async (req, res) => {
  try {
    const sessionId = req.sessionID;
    await prisma.solves.deleteMany({
      where: {
        sessionId: sessionId,
      },
    });
    return res.status(200).json({
      msg: "solves deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting solves");
    return res.status(500).json({ error, msg: "Error deleting solves" });
  }
};
