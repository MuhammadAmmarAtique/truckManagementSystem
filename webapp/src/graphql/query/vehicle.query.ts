import { gql } from "@apollo/client";

export const GET_ALL_VEHICLES = gql`
  query GetAllVehicles {
    getAllVehicles {
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
      assignedJobs{
        id
      }
      createdAt
      updatedAt
    }
  }
`;
