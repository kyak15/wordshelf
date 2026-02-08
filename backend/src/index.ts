import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { testConnection } from "./db";
import { apiRouter } from "./router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.listen(env.port, async () => {
  console.log(`Server running at http://localhost:${env.port}`);
  try {
    const ok = await testConnection();
    if (ok) console.log("Database connected");
  } catch (e) {
    console.warn(
      "Database connection failed (start server anyway):",
      (e as Error).message
    );
  }
});
