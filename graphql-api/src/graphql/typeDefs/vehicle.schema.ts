
export const vehicleTypeDefs = `#graphql
  scalar Date
  scalar JSON

  type Document {
    name: String
    size: Int
    type: String
    dataUrl: String
    documentType: String
    documentDate: Date
    description: String
  }

  type Location {
    value: String!
    label: String!
  }

  type Job {
    id: ID!
    jobReference: String
    jobDate: Date
    jobType: String
    paymentType: String
    fleet: String
    shift: String
    deliveryType: String
    rollover: Boolean
    customFieldGroup: String
    billable: String!
    pickupFrom: String!
    deliverTo: String!
    pickupLocation: Location
    deliverLocation: Location
    selectedItem: String!
    orderQty: Int
    duplicateCount: Int
    documents: [Document]
    customFieldValues: JSON
    createdBy: String!
    createdAt: Date
    updatedAt: Date
  }

  type Vehicle {
    id: ID!
    identifier: String!
    fleets: String
    licencePlate: String!
    vehicleClass: String!
    allowShifts: String
    shiftTemplates: String
    vinChassisNumber: Int
    engineNumber: Int
    tonnage: Int
    make: String
    registrationExpiry: Date
    odometerReading: Int
    formSelection: String
    axles: Int
    documents: [Document]
    owner: String!
    assignedJobs: [Job]
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    getAllVehicles: [Vehicle!]!
    getVehicleById(id: ID!): Vehicle
  }

  input DocumentInput {
    name: String
    size: Int
    type: String
    dataUrl: String
    documentType: String
    documentDate: Date
    description: String
  }

  input VehicleInput {
    identifier: String!
    fleets: String
    licencePlate: String!
    vehicleClass: String!
    allowShifts: String
    shiftTemplates: String
    vinChassisNumber: Int
    engineNumber: Int
    tonnage: Int
    make: String
    registrationExpiry: Date
    odometerReading: Int
    formSelection: String
    axles: Int
    documents: [DocumentInput]
    customFieldValues: JSON
  }

  type DeleteVehicleResponse {
    id: ID!
  }

  type Mutation {
    createVehicle(input: VehicleInput!): Vehicle!
    updateVehicle(id: ID!, input: VehicleInput!): Vehicle!
    deleteVehicle(id: ID!): ID!
    assignJobToVehicle(vehicleId: ID!, jobId: ID!): Vehicle!
    unassignJobFromVehicle(vehicleId: ID!, jobId: ID!): Vehicle!
  }

  # 🔥 New payload type for job assignment events
  type JobAssignmentPayload {
    vehicle: Vehicle!
    job: Job!
  }

  type Subscription {
    vehicleCreated: Vehicle
    vehicleUpdated: Vehicle
    vehicleDeleted: ID!
    assignJobToVehicle: JobAssignmentPayload!   # New
    unassignJobFromVehicle: JobAssignmentPayload! # New
  }
`;