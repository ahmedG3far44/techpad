import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import rootRoute from "./routes/rootRoute";

dotenv.config();

const app = express();

const port = process.env.PORT as string;
const env = process.env.NODE_ENV as string;
const allowedOrigins = process.env.ALLOWED_ORIGINS as string;

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => {
    console.log("db connected success!");
  })
  .catch(() => {
    console.log("db connection failed!!");
  });

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send(`<div>
    <h1>TechPad E-commerce API</h1>
    <p>Environment: ${env}</p>
    <p>Port: ${port}</p>
    <p>Allowed Origins: ${allowedOrigins}</p>
  </div>`);
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: `TechPad E-commerce server is running good in ${env} environment!`,
  });
});
app.use("/api", rootRoute);

app.listen(port, () => {
  console.log(`Http server is running on port ${port} in ${env} environment`);
});
