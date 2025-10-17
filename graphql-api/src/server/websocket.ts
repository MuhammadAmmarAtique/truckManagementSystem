import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import jwt from "jsonwebtoken";
import { schema } from "@/graphql/schema.js";
import { getKey } from "@/config/jwks.js";
import { config } from "@/config/env.js";

export function setupWebsocket(httpServer: any) {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer(
    {
      schema,
      // Validating JWT manually with jwt.verify with &  JWKS public key
      // & passing the verified user into the subscription context.
            context: async (ctx) => {
        try {
          // First check headers object (if frontend sends headers inside connectionParams)
          const headers = ctx.connectionParams?.headers as
            | Record<string, any>
            | undefined;
          // Or check direct Authorization key (how Sandbox sends it)
          const authHeader =
            headers?.Authorization ||
            headers?.authorization ||
            (ctx.connectionParams as any)?.Authorization ||
            (ctx.connectionParams as any)?.authorization;
          if (!authHeader) throw new Error("Missing Authorization header");
 
          const token = authHeader.split(" ")[1];
          if (!token) throw new Error("Missing auth token");
 
          const decoded = await new Promise((resolve, reject) => {
            jwt.verify(
              token,
              getKey,
              {
                audience: config.auth0.audience,
                issuer: `https://${config.auth0.domain}/`,
                algorithms: config.auth0.algorithms,
              },
              (err, decoded) => (err ? reject(err) : resolve(decoded))
            );
          });
 
          return { user: decoded };
        } catch (err: any) {
          console.log("WebSocket Auth Error:", err.message);
          throw new Error("Unauthorized: Invalid or expired token");
        }
      },
    },
    wsServer
  );

  console.log(`Subscriptions ready at ws://localhost:${config.port}/graphql`);
}
