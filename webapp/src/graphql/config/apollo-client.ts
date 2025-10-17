import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// HTTP link
const httpLink = new HttpLink({
  uri: String(process.env.NEXT_PUBLIC_GRAPHQL_HTTP),
});

// WebSocket link (only in browser)
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: String(process.env.NEXT_PUBLIC_GRAPHQL_WS),
          connectionParams: async () => {
            // injecting auth token for subscriptions
            const res = await fetch("/api/me");
            const { accessToken } = await res.json();
            return {
              headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : "",
              },
            };
          },
        })
      )
    : null;

// Split link (ws for subscriptions, http for others)
const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

// Auth link for queries/mutations
const authLink = setContext(async (_, { headers }) => {
  const res = await fetch("/api/me");
  const { accessToken } = await res.json();
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

// Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});
