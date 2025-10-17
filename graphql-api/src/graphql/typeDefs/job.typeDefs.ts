export const jobTypeDefs = `#graphql
  scalar Date
  scalar JSON

  type Document {
    name: String
    size: Int
    type: String
    dataUrl: String
    documentType: String
    description: String
  }

  type Location {
    value: String!
    label: String!
  }

  # New Items type
  type Item {
    name: String!
    qty: Int!
    unit: String!
  }

  type Job {
    id: ID!  # Apollo automatically maps _id → id
    jobReference: String
    jobDate: Date

    # Job Configuration
    jobType: String
    paymentType: String
    fleet: String
    shift: String
    deliveryType: String
    rollover: Boolean
    customFieldGroup: String

    # Job Route
    billable: String!
    pickupFrom: String!
    deliverTo: String!
    pickupLocation: Location
    deliverLocation: Location

    # Items
    selectedItem: String!
    orderQty: Int
    primaryUnit: String       
    itemsList: [Item!]

    # Duplicate Jobs
    duplicateCount: Int

    # Documents
    documents: [Document]

    # Custom fields (flexible key-value pairs)
    customFieldValues: JSON

    # User
    createdBy: String!

    # Job Status
    jobStatus: String

    createdAt: Date
    updatedAt: Date
  }

  type Query {
    jobs: [Job!]!
    job(id: ID!): Job
  }

  input DocumentInput {
    name: String
    size: Int
    type: String
    dataUrl: String
    documentType: String
    description: String
  }

  input LocationInput {
    value: String!
    label: String!
  }

  input ItemInput {
    name: String!
    qty: Int!
    unit: String!
  }

  input JobInput {
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
    pickupLocation: LocationInput
    deliverLocation: LocationInput

    selectedItem: String!
    orderQty: Int
    primaryUnit: String        
    itemsList: [ItemInput!]

    duplicateCount: Int
    documents: [DocumentInput]

    customFieldValues: JSON
    jobStatus: String
  }

  type DeleteJobResponse {
    id: ID!
  }

  type Mutation {
    createJob(input: JobInput!): Job!
    updateJob(id: ID!, input: JobInput!): Job!
    deleteJob(id: ID!): DeleteJobResponse!
    updateJobStatus(id: ID!, status: String!): Job!
  }

  # It defines the events clients can listen for
  type Subscription {
    jobCreated: Job
    jobUpdated: Job
    jobDeleted: ID!
  }
`;
