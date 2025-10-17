import { gql } from "@apollo/client";

export const JOB_ASSIGNED_SUBSCRIPTION = gql`
  subscription OnJobAssigned {
    assignJobToVehicle {
      vehicle {
        id
        assignedJobs {
          id
          jobReference
          pickupFrom
          deliverTo
        }
      }
      job {
        id
        jobReference
        pickupFrom
        deliverTo
      }
    }
  }
`;

export const JOB_UNASSIGNED_SUBSCRIPTION = gql`
  subscription OnJobUnassigned {
    unassignJobFromVehicle {
      vehicle {
        id
        assignedJobs {
          id
          jobReference
          pickupFrom
          deliverTo
        }
      }
      job {
        id
        jobReference
        pickupFrom
        deliverTo
      }
    }
  }
`;
