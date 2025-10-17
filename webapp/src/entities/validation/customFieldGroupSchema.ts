import * as yup from "yup";
import { ICustomFieldGroup } from "../types/customFieldGroupTypes";

export const customFieldGroupSchema: yup.ObjectSchema<ICustomFieldGroup> =
  yup.object({
    id: yup.string().nullable().notRequired(),
    name: yup.string().trim().required("Custom Field Group Name is required"),
    customFields: yup
      .array()
      .of(
        yup.object({
          customFieldId: yup
            .string()
            .nullable()
            .required("Select Custom Field"),
          customFieldName: yup.string().required(),
          systemVisibility: yup
            .string()
            .oneOf(["Editable", "View only", "Hidden"])
            .required(),
          driverVisibility: yup
            .string()
            .oneOf(["Editable", "View only", "Hidden"])
            .required(),
          requiredStage: yup
            .string()
            .nullable()
            .oneOf([null, "Planning", "In Transit", "Delivered"]),
          replicate: yup.boolean().notRequired(),
        })
      )
      .min(1, "At least one custom field configuration is required")
      .test(
        "no-duplicates",
        "Duplicate custom fields are not allowed",
        (fields) => {
          if (!fields) return true;
          const ids = fields.map((f) => f.customFieldId).filter(Boolean);
          return ids.length === new Set(ids).size;
        }
      )
      .required(),
  });
