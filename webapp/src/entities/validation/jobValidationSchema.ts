import * as yup from "yup";
import type IJobFormState from "../types/jobTypes";
import { JobType, PaymentType, JobStatusType } from "../types/jobTypes";

export const jobValidationSchema: yup.ObjectSchema<IJobFormState> = yup.object({
  // Job Details
  id: yup.string().notRequired().nullable(),

  jobReference: yup
    .string()
    .nullable()
    .notRequired()
    .max(20, "Job Reference cannot exceed 20 characters"),

  jobDate: yup
    .date()
    .nullable()
    .required("Job date is required")
    .typeError("Please select a valid date"),

  // Job Configuration
  jobType: yup
    .mixed<"Pickup and Delivery" | "">()
    .oneOf(Object.values(JobType), "Please select a valid job type"),

  paymentType: yup
    .mixed<"cod" | "prepaid" | "account" | "">()
    .oneOf(Object.values(PaymentType), "Please select a valid payment type"),

  fleet: yup.string().nullable().notRequired(),

  shift: yup.string().nullable().notRequired(),

  deliveryType: yup.string().nullable().notRequired(),

  rollover: yup.boolean().nullable().notRequired(),

  customFieldGroup: yup.string().nullable().notRequired(),

  // Job Route
  billable: yup.string().required("Billable field is required"),

  pickupFrom: yup.string().required("Origin field is required"),

  deliverTo: yup.string().required("Destination field is required"),

  pickupLocation: yup
    .object({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .required("Pickup location is required"),

  deliverLocation: yup
    .object({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .required("Deliver location is required"),

  // Items
  selectedItem: yup.string().when("itemsList", {
    is: (itemsList: any[]) => !itemsList || itemsList.length === 0,
    then: (schema) => schema.required("At least one item is required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  orderQty: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("itemsList", {
      is: (itemsList: any[]) => !itemsList || itemsList.length === 0,
      then: (schema) =>
        schema
          .typeError("Please provide a quantity")
          .required("Please provide a quantity")
          .integer("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

  primaryUnit: yup.string().notRequired().nullable(),

  itemsList: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(),
        qty: yup.number().positive().integer().required(),
        unit: yup.string().required(),
      })
    )
    .default([])
    .test("at-least-one-item", "Click on (+) to add an item", function (list) {
      const { selectedItem, orderQty } = this.parent;

      // if fields are filled but item not added
      if (selectedItem && orderQty && (!list || list.length === 0)) {
        return false;
      }
      return true;
    }),

  // Duplicate Jobs
  duplicateCount: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? null : value
    )
    .notRequired()
    .test(
      "is-between-1-20",
      "Please enter a value between 1 and 20",
      (value) =>
        value == null || (Number.isInteger(value) && value >= 1 && value <= 20)
    )
    .typeError("Please enter a valid number"),

  // Documents
  documents: yup
    .array()
    .of(
      yup.object({
        name: yup.string().notRequired(),
        size: yup.number().notRequired(),
        type: yup.string().notRequired(),
        dataUrl: yup.string().notRequired(),
        documentType: yup.string().notRequired(),
        description: yup.string().notRequired(),
      })
    )
    .optional(),

  // Dynamic Custom Fields inside Job Configuration
  customFieldValues: yup
    .object<Record<string, any>>()
    .notRequired() as yup.ObjectSchema<Record<string, any> | undefined>,

  //  Job Status
  jobStatus: yup
    .mixed<"idle" | "In Progress" | "complete" | "">()
    .oneOf(Object.values(JobStatusType), "Please select a valid job Status"),
});
