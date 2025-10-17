// Its Used by both Apollo (HTTP queries/mutations) and graphql-ws (subsriptions)
import { makeExecutableSchema } from "@graphql-tools/schema";
import { jobTypeDefs } from "./typeDefs/job.typeDefs.js";
import { jobResolvers } from "./resolvers/job.resolvers.js";
import { vehicleResolvers } from "./resolvers/vehicle.resolver.js";
import { vehicleTypeDefs } from "./typeDefs/vehicle.schema.js";

export const schema = makeExecutableSchema({
  typeDefs: [jobTypeDefs, vehicleTypeDefs],
  resolvers: [jobResolvers, vehicleResolvers],
});
