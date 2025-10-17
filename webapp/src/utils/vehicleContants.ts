import type { Vehicle } from "@/entities/types/vehicleTypes";

export const getShiftTemplateLabel = (value: string | null) => {
  const option = SHIFT_TEMPLATE_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : "---";
};

export const FLEET_OPTIONS = [
  { value: "fleet1", label: "Fleet 1" },
  { value: "fleet2", label: "Fleet 2" },
];

export const VEHICLE_CLASS_OPTIONS = [
  { value: "heavy_combination", label: "Heavy Combination" },
  { value: "light_vehicle", label: "Light Vehicle" },
  { value: "motorcycle", label: "Motorcycle" },
];

export const SHIFT_TEMPLATE_OPTIONS = [
  { value: "template1", label: "Morning Shift" },
  { value: "template2", label: "Evening Shift" },
];

export const DOCUMENT_TYPE_OPTIONS = [
  { value: "POD", label: "Point of Delivery (POD)" },
  { value: "POP_Signature", label: "Point of Pickup Signature" },
  { value: "POP", label: "Point of Pickup (POP)" },
  { value: "Driver_Licence", label: "Driver's Licence" },
];

export const FORM_OPTIONS = [
  { value: "pre-checklist", label: "Pre-Checklist" },
];

export const TOOLTIP_MESSAGES = {
  SHARE_PAGE: "Share Page",
  LINK_COPIED: "Link copied to clipboard!",
  FAILED_TO_COPY: "Failed to copy link.",
};

export const formatValue = (value: any): string => {
  if (value == null) {
    return "---";
  }

  return String(value) || "---";
};

const VEHICLE_COLORS = [
  "#E53935", // Red
  "#8E24AA", // Purple
  "#3949AB", // Indigo
  "#00897B", // Teal
  "#43A047", // Green
  "#FFB300", // Amber
  "#FB8C00", // Orange
  "#6D4C41", // Brown
  "#1E88E5", // Blue
  "#D81B60", // Pink
];

export const getVehicleAvatarInitial = (vehicle: Vehicle) => {
  return (vehicle.identifier || vehicle.licencePlate || "---")
    .charAt(0)
    .toUpperCase();
};

// The function now takes an index directly
export const getVehicleColor = (index: number) => {
  return VEHICLE_COLORS[index % VEHICLE_COLORS.length];
};
