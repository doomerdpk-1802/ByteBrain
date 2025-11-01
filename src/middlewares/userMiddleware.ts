import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET_STR } from "../config.js";

interface UserJwtPayload extends JwtPayload {
  userId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const JWT_SECRET = JWT_SECRET_STR;

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const token = authHeader.split(" ")[1] || authHeader;

  try {
    const decodedUser = jwt.verify(
      token,
      JWT_SECRET as string
    ) as UserJwtPayload;

    if (!decodedUser.userId) {
      return res.status(403).json({ error: "Unauthorized!" });
    }

    req.userId = decodedUser.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Unauthorized!" });
  }
}
