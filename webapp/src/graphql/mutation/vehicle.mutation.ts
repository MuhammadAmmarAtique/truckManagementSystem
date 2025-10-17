// frontend/graphql/vehicleMutations.ts
import { gql } from "@apollo/client";

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle($input: VehicleInput!) {
    createVehicle(input: $input) {
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

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($id: ID!, $input: VehicleInput!) {
    updateVehicle(id: $id, input: $input) {
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

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;
