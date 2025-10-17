//src/validation/Schema.ts
import * as yup from "yup";
import { isFuture, isToday } from "date-fns";

const maxFileSize = 5242880; // 5MB

// Field definition types
export type FieldType =
  | "text"
  | "select"
  | "toggle"
  | "number"
  | "date"
  | "file_advanced";

// Document file type - aligned with VehicleForm interface
export interface DocumentFile {
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // Added optional dataUrl
  documentType?: string | null;
  documentDate?: Date | null;
}

// Validation schema factory
export const createVehicleValidationSchema = (
  entityData: any,
  existingIdentifiers: string[],
  existingLicencePlates: string[]
) => {
  return yup.object().shape({
    identifier: yup
      .string()
      .required("Identifier is required")
      .min(5, "Identifier must be of atleast 5 characters")
      .max(14, "Identifier cannot exceed 14 characters")
      .notOneOf(existingIdentifiers, "Identifier must be unique"),
    fleets: yup.string().nullable().default(""),
    licencePlate: yup
      .string()
      .required("Licence Plate is required")
      .min(5, "Licence Plate must be of atleast 5 characters")
      .max(14, "Licence Plate cannot exceed 14 characters")
      .notOneOf(existingLicencePlates, "License Plates must be unique"),
    vehicleClass: yup.string().required("Vehicle Class is required"),
    formSelection: yup.string().required("Form is required"),
    allowShifts: yup
      .string()
      .required("Allow Shifts is required")
      .default("Yes"),
    shiftTemplates: yup.string().nullable().default(""),
    vinChassisNumber: yup
      .number()
      .nullable()
      .transform((value: unknown, originalValue: unknown) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("VIN/Chassis Number must be a number")
      .integer("VIN/Chassis Number must be a whole number")
      .test(
        "len",
        "VIN/Chassis Number must be between 6 and 14 digits",
        (value: number | null | undefined) => {
          if (value == null) return true;
          const length = value.toString().length;
          return length >= 6 && length <= 14;
        }
      ),
    engineNumber: yup
      .number()
      .nullable()
      .transform((value: unknown, originalValue: unknown) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("Engine Number must be a number")
      .integer("Engine Number must be a whole number")
      .test(
        "len",
        "Engine Number must be between 6 and 14 digits",
        (value: number | null | undefined) => {
          if (value == null) return true;
          const length = value.toString().length;
          return length >= 6 && length <= 14;
        }
      ),
    tonnage: yup
      .number()
      .required("Tonnage is required")
      .transform((value: unknown, originalValue: unknown) =>
        String(originalValue).trim() === "" ? null : value
      )
      .min(0, "Tonnage cannot be negative")
      .typeError("Tonnage must be a number"),

    make: yup
      .string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value === "" ? null : value
      )
      .matches(/^[A-Za-z\s]*$/, "Make should only contain letters")
      .min(3, "Make should be at least 3 characters")
      .max(14, "Make cannot exceed 14 characters")
      .test(
        "make-optional",
        "Make should be at least 3 characters if provided",
        (value: string | null | undefined) => {
          return !value || value.length === 0 || value.length >= 3;
        }
      )
      .default(""),
    registrationExpiry: yup
      .date()
      .required("Registration Expiry is required")
      .typeError("Invalid Date")
      .transform((value, original) => (original === "" ? null : value))
      .test(
        "is-future-or-today-date",
        "Registration Expiry must be today's date or a future date",
        (value: Date | null | undefined) => {
          if (!value) return true;
          return isFuture(value) || isToday(value);
        }
      ),
    odometerReading: yup
      .number()
      .required("Odometer Reading is required")
      .transform((value: unknown, originalValue: unknown) =>
        String(originalValue).trim() === "" ? null : value
      )
      .min(0, "Odometer Reading cannot be negative")
      .typeError("Odometer Reading must be a number"),
    axles: yup
      .number()
      .nullable()
      .transform((value: unknown, originalValue: unknown) =>
        String(originalValue).trim() === "" ? null : value
      )
      .integer("Axles must be a whole number")
      .min(0, "Axles cannot be negative")
      .typeError("Axles must be a number"),
    documents: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().required("Document name is required"),
          size: yup
            .number()
            .required("Document size is required")
            .max(maxFileSize, "File size must be less than 5MB"),
          type: yup
            .string()
            .required("Document file type is required")
            .test(
              "file-type",
              "Unsupported file type. Allowed: .png, .jpeg, .jpg, .pdf, .doc, .txt, .csv, .docx, .xls, .xlsx, .rtf",
              (value: string | null | undefined) => {
                if (!value) return false;
                const allowedMimeTypes = [
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
                ];
                return allowedMimeTypes.includes(value);
              }
            ),
          dataUrl: yup.string().optional(),
          documentType: yup.string().nullable().default(""),
          documentDate: yup
            .date()
            .nullable()
            .transform((value, originalValue) => {
              if (!originalValue || originalValue === "") return null;
              return new Date(originalValue); // force convert string → Date
            })
            .typeError("Invalid document date"),
        })
      )
      .nullable()
      .default([]),
  });
};
