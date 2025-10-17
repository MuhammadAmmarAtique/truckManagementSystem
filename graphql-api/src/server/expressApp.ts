import express, { Request } from "express";
import cors from "cors";
import morgan from "morgan";
import { expressMiddleware } from "@as-integrations/express5";
import { checkJwt } from "@/config/auth.js";
import { config } from "@/config/env.js";
import { errorMiddleware } from "@/middlewares/errorHandler.middleware.js";
import { authErrorMiddleware } from "@/middlewares/authError.middleware.js";
import { ApolloServer } from "@apollo/server";

interface AuthenticatedRequest extends Request {
  auth?: any;
}

export function createExpressApp(apollo: ApolloServer) {
  const app = express();

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(morgan("dev"));

  app.get("/", (_req, res) => res.send("Express API is running."));

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    // Authorization Handler: if token is valid it attaches the decoded JWT payload to req.auth
    // If token is invalid/missing → it throws a 401 Unauthorized
    (req, res, next) => {
      const isDev = config.nodeEnv !== "production";

      if (req.method === "GET" && isDev) return next();
      if (
        isDev &&
        req.method === "POST" &&
        req.body?.operationName === "IntrospectionQuery"
      ) {
        return next();
      }

      return checkJwt(req, res, next);
    },
    expressMiddleware(apollo, {
      // It pulls the authenticated user from req.auth added by checkJWT
      // to make sure  user available inside GraphQL resolvers
      context: async ({ req }) => {
        const user = (req as AuthenticatedRequest).auth || null;
        return { user };
      },
    })
  );

  app.use(authErrorMiddleware);
  app.use(errorMiddleware);

  return app;
}
