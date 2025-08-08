import express from "express";
import dotenv from "dotenv";
import dataRouter from "./routes/dataRouter.js";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "./generated/prisma/index.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
//for railway
app.set("trust proxy", 1);

//cors setup
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();

app.use(cookieParser());
const isLocal =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: isLocal ? "lax" : "none",
      secure: !isLocal,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: null,
      dbRecordIdIsSessionId: true,
    }),
  })
);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/check-session", (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  res.json({ session: req.session });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.use("/dataRouter", dataRouter);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
}

export default app;
