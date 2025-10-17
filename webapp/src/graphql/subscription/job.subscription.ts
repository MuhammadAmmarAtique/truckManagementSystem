import { gql } from "@apollo/client";

export const JOB_CREATED = gql`
  subscription {
    jobCreated {
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

export const JOB_UPDATED = gql`
  subscription {
    jobUpdated {
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
      itemsList {
        name
        qty
        unit
      }
    }
  }
`;

export const JOB_DELETED = gql`
  subscription {
    jobDeleted
  }
`;
