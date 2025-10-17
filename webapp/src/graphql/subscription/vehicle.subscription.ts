import { gql } from "@apollo/client";

export const VEHICLE_CREATED_SUBSCRIPTION = gql`
  subscription {
    vehicleCreated {
      id
      identifier
      fleets
      licencePlate
      vehicleClass
      allowShifts
      shiftTemplates
      vinChassisNumber
      engineNumber
      tonnage
      make
      registrationExpiry
      odometerReading
      formSelection
      axles
      documents {
        name
        size
        type
        dataUrl
        documentType
        documentDate
      }
      createdAt
      updatedAt
    }
  }
`;

export const VEHICLE_UPDATED_SUBSCRIPTION = gql`
  subscription {
    vehicleUpdated {
      id
      identifier
      fleets
      licencePlate
      vehicleClass
      allowShifts
      shiftTemplates
      vinChassisNumber
      engineNumber
      tonnage
      make
      registrationExpiry
      odometerReading
      formSelection
      axles
      documents {
        name
        size
        type
        dataUrl
        documentType
        documentDate
      }
      createdAt
      updatedAt
    }
  }
`;

export const VEHICLE_DELETED_SUBSCRIPTION = gql`
  subscription {
    vehicleDeleted
  }
`;
