import { ApolloServer } from "@apollo/server";
import { schema } from "@/graphql/schema.js";

export async function createApolloServer() {
  const server = new ApolloServer({ schema });
  await server.start();
  console.log("Apollo Server started");
  return server;
}
