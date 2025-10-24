import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Error fetching JWT_SECRET from environment variables");
}

// extending the existing Request interface to include a new optional property
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
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const token = authHeader.split(" ")[1] || authHeader;

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    req.userId = decodedUser.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized!" });
  }
}
