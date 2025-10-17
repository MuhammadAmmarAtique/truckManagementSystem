import { gql } from "@apollo/client";

export const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      jobReference
      jobDate
      jobType
      paymentType
      fleet
      shift
      deliveryType
      rollover
      customFieldGroup
      billable
      pickupFrom
      deliverTo
      pickupLocation {
        value
        label
      }
      deliverLocation {
        value
        label
      }
      selectedItem
      orderQty
      duplicateCount
      documents {
        name
        size
        type
        dataUrl
        documentType
        description
      }
      customFieldValues
      createdAt
      updatedAt
      jobStatus
    }
  }
`;

export const GET_JOB_BY_ID = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      id
      jobReference
      jobDate
      jobType
      paymentType
      fleet
      shift
      billable
      pickupFrom
      deliverTo
      selectedItem
      orderQty
      itemsList {
        name
        qty
        unit
      }
      documents {
        name
        size
        type
        dataUrl
        documentType
        description
      }
      pickupLocation {
        value
        label
      }
      deliverLocation {
        value
        label
      }
      jobStatus
      rollover
      deliveryType
    }
  }
`;
