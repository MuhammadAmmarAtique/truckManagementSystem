// 1) enums used inside job Validation Schema
export enum JobType {
  PickupAndDelivery = "Pickup and Delivery",
  None = "",
}

export enum PaymentType {
  COD = "cod",
  Prepaid = "prepaid",
  Account = "account",
  None = "",
}

export enum JobStatusType {
  Idle = "idle",
  InProgress = "In Progress",
  Complete = "complete",
  None = "",
}

// 2) interfaces
export interface DocumentType {
  name?: string | null;
  size?: number | null;
  type?: string | null;
  dataUrl?: string | null;
  documentType?: string | null;
  description?: string | null;
}

export default interface IJobFormState {
  // 1) Job Details
  id?: string | null;
  jobReference?: string | null;
  jobDate: Date | null;

  // 2) Job Configuration
  jobType?: "Pickup and Delivery" | "";
  paymentType?: "cod" | "prepaid" | "account" | "";
  fleet?: string | null;
  shift?: string | null;
  deliveryType?: string | null;
  rollover?: boolean | null;
  customFieldGroup?: string | null;

  // 3) Job Route
  billable: string;
  pickupFrom: string;
  deliverTo: string;
  pickupLocation: { value: string; label: string } | null;
  deliverLocation: { value: string; label: string } | null;

  // 4) Items
  selectedItem?: string | null;
  orderQty?: number | null;
  primaryUnit?: string | null;
  itemsList?: { name: string; qty: number; unit: string }[];

  // 5) Duplicate Jobs
  duplicateCount?: number | null | undefined;

  // 6) Documents
  documents?: DocumentType[];

  // 7) Dynamic Custom Fields inside Job Configuration
  customFieldValues?: {
    [key: string]: string | number | boolean | null;
  };

  // 8)Job Status
  jobStatus?: "idle" | "In Progress" | "complete" | "";
}
