// src/config/vehicleFieldsConfig.ts
import { getShiftTemplateLabel, formatValue } from "@/utils/vehicleContants";
// The type for our field categories
export type VehicleFieldCategory =
  | "basic"
  | "specifications"
  | "settings"
  | "documentation"
  | "operational"
  | "form";

// The type for the field's input type
export type FieldType =
  | "text"
  | "select"
  | "toggle"
  | "number"
  | "date"
  | "file_advanced";

// The comprehensive interface for a single field
export interface VehicleField {
  label: string;
  key: string;
  type: FieldType;
  category: VehicleFieldCategory;
  formatter?: (value: any) => string; // Optional: used for displaying details
  required?: boolean; // Optional: used for form validation
  options?: string[] | string; // Optional: used for select/toggle fields
  defaultValue?: string; // Optional: used for form
  conditional?: string; // Optional: for fields with conditional logic
}

// The single, master list of all fields
export const VEHICLE_FIELDS: VehicleField[] = [
  // Form Fields (can also be displayed in details)
  {
    label: "Identifier",
    key: "identifier",
    type: "text",
    category: "form",
    required: true,
    formatter: formatValue,
  },
  {
    label: "Fleets",
    key: "fleets",
    type: "select",
    category: "form",
    options: "FLEET_OPTIONS",
    formatter: formatValue,
  },
  {
    label: "Licence Plate",
    key: "licencePlate",
    type: "text",
    category: "form",
    required: true,
    formatter: formatValue,
  },
  {
    label: "Vehicle Class",
    key: "vehicleClass",
    type: "select",
    category: "form",
    options: "VEHICLE_CLASS_OPTIONS",
    required: true,
    formatter: formatValue,
  },
  {
    label: "Shift Template",
    key: "shiftTemplates",
    type: "select",
    category: "form",
    options: "SHIFT_TEMPLATE_OPTIONS",
    conditional: "allowShifts",
    formatter: (value) => getShiftTemplateLabel(value as string) || "---", // Use the new formatter
  },
  {
    label: "VIN/Chassis Number",
    key: "vinChassisNumber",
    type: "number",
    category: "form",
    formatter: formatValue,
  },
  {
    label: "Engine Number",
    key: "engineNumber",
    type: "number",
    category: "form",
    formatter: formatValue,
  },
  {
    label: "Tonnage (Capacity)",
    key: "tonnage",
    type: "number",
    category: "form",
    required: true,
    formatter: (value) => (value ? `${value} tons` : "---"),
  },
  {
    label: "Make",
    key: "make",
    type: "text",
    category: "form",
    formatter: formatValue,
  },
  {
    label: "Registration Expiry",
    key: "registrationExpiry",
    type: "date",
    category: "form",
    required: true,
    formatter: (value) => {
      if (!value) return "---";
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return "---";
      }
    },
  },
  {
    label: "Odometer Reading",
    key: "odometerReading",
    type: "number",
    category: "form",
    required: true,
    formatter: (value) => (value ? `${value} km` : "---"),
  },
  {
    label: "Form",
    key: "formSelection",
    type: "select",
    category: "form",
    options: "FORM_OPTIONS",
    required: true,
    formatter: formatValue,
  },
  {
    label: "Axles",
    key: "axles",
    type: "number",
    category: "form",
    formatter: formatValue,
  },
  {
    label: "Documents",
    key: "documents",
    type: "file_advanced",
    category: "form",
  },
];

export const getFieldsByCategory = (
  category: VehicleFieldCategory
): VehicleField[] => {
  return VEHICLE_FIELDS.filter((field) => field.category === category);
};
