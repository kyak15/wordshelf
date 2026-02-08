import express from "express";
import cors from "cors";
import { apiRouter } from "./router";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
