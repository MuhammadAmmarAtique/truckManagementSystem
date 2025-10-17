import * as yup from "yup";
import type { ICustomFieldTemplate } from "../types/customFieldTemplateTypes";

export const FIELD_TYPES = ["Text", "Number", "Date", "Boolean"];
export const VISIBILITY_OPTIONS = ["Editable", "View only", "Hidden"];

export const customFieldTemplateValidationSchema: yup.ObjectSchema<ICustomFieldTemplate> =
  yup.object({
    id: yup.string().notRequired().nullable(),

    name: yup
      .string()
      .required("Name field is required")
      .max(50, "Max limit reached"),

    type: yup
      .string()
      .oneOf(FIELD_TYPES, "Type field is required")
      .required("Type field is required"),

    systemVisibility: yup
      .string()
      .oneOf(VISIBILITY_OPTIONS, "System Visibility field is required")
      .required("System Visibility field is required"),

    driverVisibility: yup
      .string()
      .oneOf(VISIBILITY_OPTIONS, "Driver Visibility field is required")
      .required("Driver Visibility field is required"),

    requiredStage: yup.string().nullable(),

    replicate: yup.boolean().required(),
  });
