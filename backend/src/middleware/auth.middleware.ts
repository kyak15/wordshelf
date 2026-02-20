import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";

export interface AuthRequest extends Request {
  user?: Awaited<ReturnType<typeof userService.findById>>;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  try {
    const { userId } = authService.verifyAccessToken(token);
    const user = await userService.findById(userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired access token" });
  }
}
