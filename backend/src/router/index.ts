import { Router } from "express";
import { authRouter } from "./auth.router";
import { healthRouter } from "./health.router";
import { libraryRouter } from "./library.router";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/library", libraryRouter)

export { apiRouter };
