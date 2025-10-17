import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = err.message || "Internal Server Error";

  // Error logging
  console.error(`[Error] - ${new Date().toISOString()}`);
  console.error("Error object:", err);
  console.error("Message:", message);
  console.error("Stack:", err.stack);

  res.status(500).json({
    success: false,
    message,
  });
};
