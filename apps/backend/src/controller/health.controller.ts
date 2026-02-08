import { Request, Response } from "express";
import { healthService } from "../services/health.service";

export const healthController = {
  get(_req: Request, res: Response): void {
    const payload = healthService.getStatus();
    res.json(payload);
  },
};
