export interface Document {
  name: string;
  __typename?: string;
  size: number;
  type: string;
  dataUrl?: string;
  documentType?: string;
  documentDate?: Date;
}

// Frontend Vehicle interface (matches GraphQL schema)
export interface Vehicle {
  _id?: string; // MongoDB ObjectId as string
  __typename?: string;
  id: string;
  identifier: string;
  fleets?: string;
  licencePlate: string;
  vehicleClass: "Light_Vehicle" | "Heavy_Combination" | "Motorcycle";
  allowShifts?: string;
  shiftTemplates?: string;
  vinChassisNumber?: number;
  engineNumber?: number;
  tonnage: number;
  make?: string;
  registrationExpiry: Date;
  odometerReading: number;
  formSelection: string;
  axles?: number;
  documents?: Document[];
  createdAt?: Date;
  updatedAt?: Date;
  assignedJobs?: { id: string }[];
}

export interface DocumentType {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  documentType: string;
  documentDate: Date | null;
}

export interface VehicleFormData {
  identifier: string;
  fleets: string;
  licencePlate: string;
  vehicleClass: string;
  allowShifts: string;
  shiftTemplates: string;
  vinChassisNumber: number | null;
  engineNumber: number | null;
  tonnage: number | null;
  make: string;
  registrationExpiry: Date | null;
  odometerReading: number | null;
  formSelection: string;
  axles: number | null;
  documents: DocumentType[];
}

export interface VehicleCreatedData {
  vehicleCreated: Vehicle;
}

export interface VehicleUpdatedData {
  vehicleUpdated: Vehicle;
}

export interface VehicleDeletedData {
  vehicleDeleted: string; // only ID is returned
}
