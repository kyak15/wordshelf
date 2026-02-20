import { Router } from "express";
import { authRouter } from "./auth.router";
import { healthRouter } from "./health.router";
import { libraryRouter } from "./library.router";
import { statsRouter } from "./stats.router";
import { wordsRouter } from "./words.router";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/library", libraryRouter);
apiRouter.use("/words", wordsRouter);
apiRouter.use("/stats", statsRouter);

export { apiRouter };
