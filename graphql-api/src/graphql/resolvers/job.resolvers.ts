import GraphQLJSON from "graphql-type-json";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { pubsub } from "../subscription/pubsub.js";
import { Job } from "@/models/jobs.model.js";

interface JobInput {
  jobReference?: string;
  jobDate?: Date;
  jobType?: string;
  paymentType?: string;
  fleet?: string;
  shift?: string;
  deliveryType?: string;
  rollover?: boolean;
  customFieldGroup?: string;
  billable: string;
  pickupFrom: string;
  deliverTo: string;
  pickupLocation?: { value: string; label: string };
  deliverLocation?: { value: string; label: string };
  selectedItem: string;
  orderQty?: number;
  duplicateCount?: number;
  documents?: any[];
  customFieldValues?: Record<string, any>;
  jobStatus?: string;
}
export enum JobStatusType {
  Idle = "idle",
  InProgress = "In Progress",
  Complete = "complete",
  None = "",
}

export const jobResolvers = {
  JSON: GraphQLJSON,

  Query: {
    jobs: async (_: unknown, _args: unknown, { user }: any) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return await Job.find({ createdBy: user.sub });
    },

    job: async (_: unknown, { id }: { id: string }, { user }: any) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }
      if (job.createdBy !== user.sub) {
        throw new GraphQLError("Not allowed", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      return job;
    },
  },

  Mutation: {
    createJob: async (
      _: unknown,
      { input }: { input: JobInput },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const ownerId = user.sub;
      const job = await Job.create({ ...input, createdBy: ownerId });
      await pubsub.publish("JOB_CREATED", { jobCreated: job });
      return job;
    },

    updateJob: async (
      _: unknown,
      { id, input }: { id: string; input: JobInput },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }
      if (job.createdBy !== user.sub) {
        throw new GraphQLError("Not allowed", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      Object.assign(job, input, { updatedAt: new Date() });
      await job.save();

      await pubsub.publish("JOB_UPDATED", { jobUpdated: job });
      return job;
    },

    deleteJob: async (_: unknown, { id }: { id: string }, { user }: any) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }
      if (job.createdBy !== user.sub) {
        throw new GraphQLError("Not allowed", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      await job.deleteOne();
      await pubsub.publish("JOB_DELETED", { jobDeleted: id });
      return { id };
    },
    updateJobStatus: async (
      _: unknown,
      { id, status }: { id: string; status: JobStatusType },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const job = await Job.findById(id);
      if (!job) {
        throw new GraphQLError("Job not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }

      if (job.createdBy !== user.sub) {
        throw new GraphQLError("Not allowed", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      job.jobStatus = status; 
      await job.save();

      await pubsub.publish("JOB_UPDATED", { jobUpdated: job });
      return job;
    },
  },

  // Subscription resolvers: allow clients to listen for real-time changes
  Subscription: {
    jobCreated: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) {
          throw new GraphQLError("Not authenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }
        return pubsub.asyncIterableIterator(["JOB_CREATED"]);
      },
    },
    jobUpdated: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) {
          throw new GraphQLError("Not authenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }
        return pubsub.asyncIterableIterator(["JOB_UPDATED"]);
      },
    },
    jobDeleted: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) {
          throw new GraphQLError("Not authenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }
        return pubsub.asyncIterableIterator(["JOB_DELETED"]);
      },
    },
  },
};
