import http from "http";
import { connectDB } from "@/database/connection.js";
import { createApolloServer } from "./server/apollo.js";
import { createExpressApp } from "./server/expressApp.js";
import { setupWebsocket } from "./server/websocket.js";
import { config } from "@/config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    const apollo = await createApolloServer();

    const app = createExpressApp(apollo);

    const httpServer = http.createServer(app);

    setupWebsocket(httpServer);

    httpServer.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port}`);
      console.log(`GraphQL endpoint: http://localhost:${config.port}/graphql`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
