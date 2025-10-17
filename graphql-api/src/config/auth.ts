// JWT Verification Middleware for "HTTP Requests"
// Uses Auth0's JWKS endpoint to validate incoming access tokens.
// Applied to Express routes to ensure only authenticated users can access them.

import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { config } from "./env.js";

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
  }),
  audience: config.auth0.audience,
  issuer: `https://${config.auth0.domain}/`,
  algorithms: config.auth0.algorithms,
});
