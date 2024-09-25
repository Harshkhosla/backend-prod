import { Request, Response, NextFunction } from "express";

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"] as string | undefined;
  if (!apiKey || apiKey !== "HARSH123") {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or missing API key" });
  }
  return next();
}
