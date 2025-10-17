// JWT Key Retrieval Helper for "WebSocket Connections"
// Fetches and returns the correct public signing key from Auth0's JWKS endpoint.
// Used to manually verify JWTs during WebSocket authentication.

import jwksRsa from "jwks-rsa";
import { config } from "./env.js";

const jwksClient = new jwksRsa.JwksClient({
  jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
});

export function getKey(header: any, callback: any) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("JWKS fetch error:", err);
      return callback(err, null);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}
