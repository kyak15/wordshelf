import { Router } from "express";
import { authController } from "../controller/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const authRouter = Router();

// OAuth Providers
authRouter.post("/google/exchange", authController.googleExchange); // POST /api/auth/google/exchange — exchange Google auth code for tokens

authRouter.post("/apple/signin", authController.appleSignIn); // POST /api/auth/apple/signin — verify Apple identityToken and sign in

// Token Management
authRouter.post("/refresh", authController.refresh); // POST /api/auth/refresh — get new access + refresh token
authRouter.post("/logout", authController.logout); // POST /api/auth/logout — revoke refresh token

// Dev Login (development only)
authRouter.post("/dev-login", authController.devLogin); // POST /api/auth/dev-login — instant login for dev/testing

// User
authRouter.get("/me", requireAuth, authController.me); // GET /api/auth/me — current user (requires Bearer token)

// Account Management
authRouter.delete("/account", requireAuth, authController.deleteAccount); // DELETE /api/auth/account — delete user account permanently
