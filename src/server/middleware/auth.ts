import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";

export default function(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header("Authorization");

  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "No token, authorization denied" });
  }

  if (!token.startsWith('Bearer')) {
    return res
    .status(HttpStatusCodes.BAD_REQUEST)
    .json({ msg: "Wrong token format, please include Bearer infront of token." });
  }

  // Verify token
  try {
    const tokenSignature = token.split(' ')[1]
    const payload: Payload | any = jwt.verify(tokenSignature, config.get("jwtSecret"));
    req.userId = payload.userId;
    req.userRole = payload.userRole;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }
}
