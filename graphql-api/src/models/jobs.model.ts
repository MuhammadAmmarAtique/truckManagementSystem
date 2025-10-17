import mongoose, { Schema, Document, Model } from "mongoose";

interface ILocation {
  value: string;
  label: string;
}

interface IDocument {
  name?: string | null;
  size?: number | null;
  type?: string | null;
  dataUrl?: string | null;
  documentType?: string | null;
  description?: string | null;
}

interface IItem {
  name: string;
  qty: number;
  unit: string;
}

export interface IJob extends Document {
  jobReference?: string | null;
  jobDate: Date | string;
  jobType?: "" | "Pickup and Delivery";
  paymentType?: "cod" | "prepaid" | "account" | "";
  fleet?: string | null;
  shift?: string | null;
  deliveryType?: string | null;
  rollover: boolean;
  customFieldGroup?: string | null;

  billable: string;
  pickupFrom: string;
  deliverTo: string;
  pickupLocation: ILocation;
  deliverLocation: ILocation;

  selectedItem: string;
  orderQty: number | string;
  primaryUnit?: string | null;
  itemsList?: IItem[];

  duplicateCount?: number | string | null;
  documents?: IDocument[];
  customFieldValues?: Record<string, any> | null;

  createdBy: string;
  jobStatus?: "idle" | "In Progress" | "complete" | "";
}

const LocationSchema = new Schema<ILocation>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const DocumentSchema = new Schema<IDocument>(
  {
    name: { type: String, default: null },
    size: { type: Number, default: null },
    type: { type: String, default: null },
    dataUrl: { type: String, default: null },
    documentType: { type: String, default: null },
    description: { type: String, default: null },
  },
  { _id: false }
);

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, default: "" },
    qty: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: "" },
  },
  { _id: false }
);

const JobSchema = new Schema<IJob>(
  {
    jobReference: { type: String, default: null },
    jobDate: { type: Schema.Types.Mixed, required: true }, // allow Date or string

    jobType: { type: String, enum: ["", "Pickup and Delivery"], default: "" },
    paymentType: {
      type: String,
      enum: ["cod", "prepaid", "account", ""],
      default: "",
    },
    fleet: { type: String, default: null },
    shift: { type: String, default: null },
    deliveryType: { type: String, default: null },
    rollover: { type: Boolean, required: true },
    customFieldGroup: { type: String, default: null },

    billable: { type: String, required: true },
    pickupFrom: { type: String, required: true },
    deliverTo: { type: String, required: true },

    pickupLocation: { type: LocationSchema, required: true },
    deliverLocation: { type: LocationSchema, required: true },

    selectedItem: { type: String, default: null },
    orderQty: {
      type: Schema.Types.Mixed,
      default: null,
    },

    primaryUnit: { type: String, default: null },

    itemsList: { type: [ItemSchema], default: [] },

    duplicateCount: {
      type: Schema.Types.Mixed,
      validate: {
        validator: (val: any) =>
          val == null || (Number(val) >= 1 && Number(val) <= 20),
        message: "Duplicate count must be between 1 and 20",
      },
      default: null,
    },

    documents: [DocumentSchema],
    customFieldValues: { type: Schema.Types.Mixed, default: null },

    createdBy: { type: String, required: true }, // storing Auth0 sub (string)
    jobStatus: { type: String, enum: ["", "idle", "In Progress", "complete"] },
  },
  { timestamps: true }
);

export const Job: Model<IJob> = mongoose.model<IJob>("Job", JobSchema);
