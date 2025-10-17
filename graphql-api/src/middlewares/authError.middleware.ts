import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "express-jwt";

export function authErrorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // If the error was already handled, skip
  if (!err) return next();

  // Handle express-jwt UnauthorizedError
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: err.message,
    });
  }

  // Handle JWT-related errors (invalid token, expired, etc.)
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "InvalidToken",
      message: err.message,
    });
  }

  // Pass everything else to the global error handler
  return next(err);
}
