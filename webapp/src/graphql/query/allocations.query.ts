import { gql } from "@apollo/client";

export const GET_ALLOCATION_DATA = gql`
  query GetAllocationData {
    getAllVehicles {
      id
      identifier
      licencePlate
      make
      assignedJobs {
        id
        jobReference
        pickupFrom
        deliverTo
      }
    }
    jobs {
      id
      jobReference
      pickupFrom
      deliverTo
    }
  }
`;

export const ASSIGN_JOB_TO_VEHICLE = gql`
  mutation AssignJobToVehicle($vehicleId: ID!, $jobId: ID!) {
    assignJobToVehicle(vehicleId: $vehicleId, jobId: $jobId) {
      id
    }
  }
`;

export const UNASSIGN_JOB_FROM_VEHICLE = gql`
  mutation UnassignJobFromVehicle($vehicleId: ID!, $jobId: ID!) {
    unassignJobFromVehicle(vehicleId: $vehicleId, jobId: $jobId) {
      id
    }
  }
`;