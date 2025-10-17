import mongoose, { Schema, Document } from "mongoose";

export interface IDocument {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  documentType: string;
  documentDate?: Date | null;
}

export interface IVehicle extends Document {
  _id: string;
  identifier: string;
  owner: string;
  fleets?: string | null;
  licencePlate: string;
  vehicleClass: "light_vehicle" | "heavy_combination" | "motorcycle";
  allowShifts?: string | null;
  shiftTemplates?: string | null;
  vinChassisNumber?: number | null;
  engineNumber?: number | null;
  tonnage: number;
  make?: string | null;
  registrationExpiry: Date;
  odometerReading: number;
  formSelection: string;
  axles?: number | null;
  documents?: IDocument[] | null;
  assignedJobs: mongoose.Types.ObjectId[]; // Added this line
}

const DocumentSchema = new Schema<IDocument>({
  name: { type: String, required: [true, "Document name is required"] },
  size: {
    type: Number,
    required: [true, "Document size is required"],
    max: [5242880, "File must be less than 5MB"],
  },
  type: {
    type: String,
    required: [true, "Document type is required"],
    enum: {
      values: [
        "image/png",
        "image/jpeg",
        "application/pdf",
        "application/msword",
        "text/plain",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/rtf",
      ],
      message: "Unsupported file type",
    },
  },
  dataUrl: { type: String },
  documentType: { type: String, default: "" },
  documentDate: { type: Date, default: null },
});

const VehicleSchema = new Schema<IVehicle>(
  {
    identifier: {
      type: String,
      required: [true, "Identifier is required"],
      minlength: [5, "Identifier must be at least 5 characters"],
      maxlength: [14, "Identifier cannot exceed 14 characters"],
    },

    fleets: { type: String, default: "" },

    owner: { type: String, required: [true, "Owner is required"] },

    licencePlate: {
      type: String,
      required: [true, "Licence Plate is required"],
      minlength: [5, "Licence Plate must be at least 5 characters"],
      maxlength: [14, "Licence Plate cannot exceed 14 characters"],
    },

    vehicleClass: {
      type: String,
      required: [true, "Vehicle Class is required"],
      enum: {
        values: ["light_vehicle", "heavy_combination", "motorcycle"],
        message: "Must be a valid vehicle class",
      },
    },

    allowShifts: { type: String, default: "Yes" },
    shiftTemplates: { type: String, default: "" },

    vinChassisNumber: {
      type: Number,
      default: null,
      validate: {
        validator: function (v: number | null) {
          if (v === null || v === undefined) return true;
          const length = v.toString().length;
          return length >= 6 && length <= 14;
        },
        message: "VIN/Chassis Number must be between 6 and 14 digits",
      },
    },

    engineNumber: {
      type: Number,
      default: null,
      validate: {
        validator: function (v: number | null) {
          if (v === null || v === undefined) return true;
          const length = v.toString().length;
          return length >= 6 && length <= 14;
        },
        message: "Engine Number must be between 6 and 14 digits",
      },
    },

    tonnage: {
      type: Number,
      required: [true, "Tonnage is required"],
      min: [0, "Tonnage cannot be negative"],
    },

    make: {
      type: String,
      default: "",
      validate: {
        validator: function (v: string | null) {
          if (!v || v === "") return true;
          return /^[A-Za-z\s]*$/.test(v) && v.length >= 3 && v.length <= 14;
        },
        message:
          "Make should only contain letters and be 3-14 characters if provided",
      },
    },

    registrationExpiry: {
      type: Date,
      required: [true, "Registration Expiry is required"],
      validate: {
        validator: function (v: Date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return v >= today;
        },
        message: "Registration Expiry must be today or a future date",
      },
    },

    odometerReading: {
      type: Number,
      required: [true, "Odometer Reading is required"],
      min: [0, "Odometer Reading cannot be negative"],
    },

    formSelection: {
      type: String,
      required: [true, "Form selection is required"],
    },

    axles: {
      type: Number,
      default: null,
      min: [0, "Axles cannot be negative"],
    },

    documents: { type: [DocumentSchema], default: [] },

    assignedJobs: [{
      type: Schema.Types.ObjectId,
      ref: 'Job', // Reference the Job model
      default: []
    }],
  },
  { timestamps: true, collection: "vehicles" }
);

// ✅ Compound unique indexes
VehicleSchema.index({ owner: 1, identifier: 1 }, { unique: true });
VehicleSchema.index({ owner: 1, licencePlate: 1 }, { unique: true });

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);