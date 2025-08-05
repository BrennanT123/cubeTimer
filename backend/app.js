import express from "express";
import dotenv from "dotenv";
import dataRouter from "./routes/dataRouter.js";
import cors from "cors";
import helmet from "helmet";

const app = express();

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

app.get("/", (req, res) => {
  res.send("API is running");
});




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.use("/dataRouter",dataRouter);


const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
}

export default app; 
