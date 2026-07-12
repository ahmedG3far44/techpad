import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ExtendedRequest } from "./../utils/types";
import { GenerateTokenParams } from "../services/userService";

const verifyToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "No authorization token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Invalid authorization format" });
      return;
    }

    const validUser = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as GenerateTokenParams;

    if (!validUser) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }

    req.user = validUser;
    next();
  } catch (err) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

export default verifyToken;
