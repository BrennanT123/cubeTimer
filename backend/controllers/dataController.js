import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const postNewTime = async (req, res) => {
  try {
    const time = parseFloat(req.body.time);
    const newTime = await prisma.solves.create({
      data: {
        time,
      },
    });
    return res.status(201).json({ msg: "Time added successfully", newTime });
  } catch (error) {
    console.error("Error adding new time");
    return res.status(500).json({ error, msg: "Error adding new time" });
  }
};

export const getTime = async (req, res) => {
  try {
    const timeId = req.params.timeId;
    const time = await prisma.solves.findUnique({
      where: { id: timeId },
    });
    return res.status(200).json({ msg: "Time retrieved successfully", time });
  } catch (error) {
    console.error("Error deleting time");
    return res.status(500).json({ error: "Error deleting time" });
  }
};

export const putPlusTwo = async (req, res) => {
  try {
    const timeId = req.params.timeId;
    const editedTime = await prisma.solves.findUnique({
      where: { id: timeId },
    });
    if (!editedTime) {
      return res.status(404).json({ error: "Time not found" });
    }
    const solve = await prisma.solves.update({
      where: {
        id: timeId,
      },
      data: {
        plusTwo: !editedTime.plusTwo,
      },
    });
    console.log(solve);
    return res.status(200).json({ msg: "Time updated successfully", solve });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating time", error });
  }
};

export const putDNF = async (req, res) => {
  try {
    const timeId = req.params.timeId;
    const editedTime = await prisma.solves.findUnique({
      where: { id: timeId },
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
    const deletedTime = await prisma.solves.findUnique({
      where: { id: timeId },
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
//gets the most recent solves. Num of solves is determined by req.body.numSolves
export const getHistory = async (req, res) => {
  try {
    const recentSolves = await prisma.solves.findMany({
      orderBy: {
        dateTime: "desc",
      },
      take: parseInt(req.query.numSolves),
    });

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
    const solveCount = await prisma.solves.count();
    const dnfCount = await prisma.solves.count({
      where: {
        dnf: true,
      },
    });
    const p2Count = await prisma.solves.count({
      where: {
        plusTwo: true,
      },
    });
    return res
      .status(200)
      .json({ msg: "Count retrieved successfully", solveCount, dnfCount, p2Count });
  } catch (error) {
    console.error("Error getting history");
  }
};
