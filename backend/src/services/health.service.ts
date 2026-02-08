import { HealthStatus } from "../model/health.model";

export const healthService = {
  getStatus(): HealthStatus {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  },
};
