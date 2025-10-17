import { gql } from "@apollo/client";

export const CREATE_JOB = gql`
  mutation CreateJob($input: JobInput!) {
    createJob(input: $input) {
      id
      jobReference
      jobDate
      billable
      pickupFrom
      deliverTo
      selectedItem
    }
  }
`;

export const UPDATE_JOB = gql`
  mutation UpdateJob($id: ID!, $input: JobInput!) {
    updateJob(id: $id, input: $input) {
      id
      jobReference
      jobDate
      billable
      pickupFrom
      deliverTo
      selectedItem
    }
  }
`;

export const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id) {
      id
    }
  }
`;

export const UPDATE_JOB_STATUS = gql`
  mutation UpdateJobStatus($id: ID!, $status: String!) {
    updateJobStatus(id: $id, status: $status) {
      id
      jobStatus
    }
  }
`;
