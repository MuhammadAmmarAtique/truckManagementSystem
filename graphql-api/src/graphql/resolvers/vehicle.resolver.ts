import GraphQLJSON from "graphql-type-json";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { pubsub } from "../subscription/pubsub.js";
import { Vehicle } from "@/models/vehicle.model.js";
import { Job } from "@/models/jobs.model.js"; 
import mongoose from "mongoose";

interface VehicleInput {
  identifier: string;
  fleets?: string | null;
  licencePlate: string;
  vehicleClass: "light_vehicle" | "heavy_combination" | "motorcycle";
  allowShifts?: string | null;
  shiftTemplates?: string | null;
  vinChassisNumber?: number | null;
  engineNumber?: number | null;
  tonnage: number;
  make?: string | null;
  registrationExpiry: Date;
  odometerReading: number;
  formSelection: string;
  axles?: number | null;
  documents?: any[] | null;
  customFieldValues?: Record<string, any>;
}

export const vehicleResolvers = {
  JSON: GraphQLJSON,

  Query: {
    getAllVehicles: async (_: unknown, _args: unknown, { user }: any) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return await Vehicle.find({ owner: user.sub }).populate('assignedJobs');
    },

    getVehicleById: async (
      _: unknown,
      { id }: { id: string },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const vehicle = await Vehicle.findById(id).populate('assignedJobs');
      if (!vehicle) {
        throw new GraphQLError("Vehicle not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }
      if (vehicle.owner !== user.sub) {
        throw new GraphQLError("Not allowed", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      return vehicle;
    },
  },

  Mutation: {
    createVehicle: async (
      _: unknown,
      { input }: { input: VehicleInput },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const ownerId = user.sub;
      const vehicle = await Vehicle.create({ ...input, owner: ownerId });
      await pubsub.publish("VEHICLE_CREATED", { vehicleCreated: vehicle });
      return vehicle;
    },

    updateVehicle: async (
      _: unknown,
      { id, input }: { id: string; input: VehicleInput },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const vehicle = await Vehicle.findById(id);
      if (!vehicle) {
        throw new GraphQLError("Vehicle not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }
      if (vehicle.owner !== user.sub) {
        throw new GraphQLError("Not allowed", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      Object.assign(vehicle, input, { updatedAt: new Date() });
      await vehicle.save();

      await pubsub.publish("VEHICLE_UPDATED", { vehicleUpdated: vehicle });
      return vehicle;
    },

    deleteVehicle: async (
      _: unknown,
      { id }: { id: string },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const vehicle = await Vehicle.findById(id);
      if (!vehicle) {
        throw new GraphQLError("Vehicle not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }
      if (vehicle.owner !== user.sub) {
        throw new GraphQLError("Not allowed", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      await vehicle.deleteOne();
      await pubsub.publish("VEHICLE_DELETED", { vehicleDeleted: id });

      return id;
    },

        assignJobToVehicle: async (
      _: unknown,
      { vehicleId, jobId }: { vehicleId: string; jobId: string },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const vehicle = await Vehicle.findById(vehicleId);
      const job = await Job.findById(jobId);

      if (!vehicle || !job) {
        throw new GraphQLError("Vehicle or Job not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }

      if (vehicle.owner !== user.sub || job.createdBy !== user.sub) {
        throw new GraphQLError("Not allowed to assign this job to this vehicle.", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const jobObjectId = new mongoose.Types.ObjectId(jobId);

      if (!vehicle.assignedJobs.includes(jobObjectId)) {
        vehicle.assignedJobs.push(jobObjectId);
        await vehicle.save();
      }

      const populatedVehicle = await vehicle.populate('assignedJobs');

      await pubsub.publish("JOB_ASSIGNED_TO_VEHICLE", {
        assignJobToVehicle: {
          vehicle: populatedVehicle,
          job,
        },
      });

      return populatedVehicle;
    },

    unassignJobFromVehicle: async (
      _: unknown,
      { vehicleId, jobId }: { vehicleId: string; jobId: string },
      { user }: any
    ) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const vehicle = await Vehicle.findById(vehicleId);
      const job = await Job.findById(jobId);

      if (!vehicle || !job) {
        throw new GraphQLError("Vehicle or Job not found", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }

      if (vehicle.owner !== user.sub || job.createdBy !== user.sub) {
        throw new GraphQLError("Not allowed to unassign this job from this vehicle.", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      vehicle.assignedJobs = vehicle.assignedJobs.filter(
        (id: any) => id.toString() !== jobId
      );
      await vehicle.save();

      const populatedVehicle = await vehicle.populate('assignedJobs');

      await pubsub.publish("JOB_UNASSIGNED_FROM_VEHICLE", {
        unassignJobFromVehicle: {
          vehicle: populatedVehicle,
          job,
        },
      });

      return populatedVehicle;
    },
  },

    Subscription: {
    vehicleCreated: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
        return pubsub.asyncIterableIterator(["VEHICLE_CREATED"]);
      },
    },
    vehicleUpdated: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
        return pubsub.asyncIterableIterator(["VEHICLE_UPDATED"]);
      },
    },
    vehicleDeleted: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
        return pubsub.asyncIterableIterator(["VEHICLE_DELETED"]);
      },
    },

    assignJobToVehicle: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
        return pubsub.asyncIterableIterator(["JOB_ASSIGNED_TO_VEHICLE"]);
      },
    },
    unassignJobFromVehicle: {
      subscribe: (_: unknown, _args: unknown, { user }: any) => {
        if (!user) throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
        return pubsub.asyncIterableIterator(["JOB_UNASSIGNED_FROM_VEHICLE"]);
      },
    },
  },
}