import { Request, Response, NextFunction } from "express";

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // i have added the api key here only didnt used the .env file for
  // that but i have created a dummmy env file to you can chek that .

  const apiKey = req.headers["x-api-key"] as string | undefined;
  if (!apiKey || apiKey !== "HARSH123") {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or missing API key" });
  }
  return next();
}
