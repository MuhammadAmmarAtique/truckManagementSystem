import dotenv from "dotenv";
import { Algorithm } from "jsonwebtoken";

dotenv.config({ path: "./.env" });

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: String(process.env.CORS),
  auth0: {
    domain: process.env.AUTH0_DOMAIN!,
    audience: process.env.AUTH0_AUDIENCE!,
    algorithms: [process.env.AUTH0_ALGORITHMS || "RS256"] as Algorithm[],
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
