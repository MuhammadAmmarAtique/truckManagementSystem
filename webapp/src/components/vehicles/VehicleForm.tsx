import React, {
  useCallback,
  useEffect,
  useMemo,
  useImperativeHandle,
  useContext,
  ForwardedRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseISO } from "date-fns";
import { Backdrop, CircularProgress } from "@mui/material";

import { createVehicleValidationSchema } from "@/entities/validation/vehicleValidationSchema";
import VehicleFormFields from "./VehicleFormFields";
import VehicleFormActions from "./VehicleFormActions";
import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  DocumentType,
  VehicleFormData,
  Vehicle,
} from "@/entities/types/vehicleTypes";

interface AddVehicleProps {
  onClose: () => void;
  onSave: (data: Vehicle) => Promise<void> | void;
  entityData?: Vehicle | null;
  isInline?: boolean;
  existingIdentifiers?: string[];
  existingLicencePlates?: string[];
}

const initialFormState: VehicleFormData = {
  identifier: "",
  fleets: "",
  licencePlate: "",
  vehicleClass: "",
  allowShifts: "Yes",
  shiftTemplates: "",
  vinChassisNumber: null,
  engineNumber: null,
  tonnage: null,
  make: "",
  registrationExpiry: null,
  odometerReading: null,
  formSelection: "",
  axles: null,
  documents: [],
};

const VehicleForm = React.forwardRef(function VehicleForm(
  {
    onClose,
    onSave,
    entityData = null,
    isInline = false,
    existingIdentifiers = [],
    existingLicencePlates = [],
  }: AddVehicleProps,
  ref: ForwardedRef<{ submit: () => void }>
) {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const validationSchema = useMemo(
    () =>
      createVehicleValidationSchema(
        entityData,
        existingIdentifiers,
        existingLicencePlates
      ),
    [entityData, existingIdentifiers, existingLicencePlates]
  );

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialFormState,
  });

  const documents = watch("documents");

  useEffect(() => {
    if (entityData) {
      let registrationExpiryDate: Date | null = null;
      if (entityData.registrationExpiry instanceof Date) {
        registrationExpiryDate = entityData.registrationExpiry;
      } else if (typeof entityData.registrationExpiry === "string") {
        const parsed = parseISO(entityData.registrationExpiry);
        registrationExpiryDate = isNaN(parsed.getTime()) ? null : parsed;
      }

      const processedDocuments = (entityData.documents || []).map(
        (doc: any) => {
          let docDate: Date | null = null;
          if (doc.documentDate instanceof Date) {
            docDate = doc.documentDate;
          } else if (typeof doc.documentDate === "string") {
            const parsedDocDate = parseISO(doc.documentDate);
            docDate = isNaN(parsedDocDate.getTime()) ? null : parsedDocDate;
          }
          return { ...doc, documentDate: docDate };
        }
      );

      reset({
        ...entityData,
        vinChassisNumber: entityData.vinChassisNumber || null,
        engineNumber: entityData.engineNumber || null,
        tonnage: entityData.tonnage || null,
        odometerReading: entityData.odometerReading || null,
        axles: entityData.axles || null,
        registrationExpiry: registrationExpiryDate,
        documents: processedDocuments,
        allowShifts: entityData.allowShifts || "Yes",
      });
    } else {
      reset(initialFormState);
    }
  }, [entityData, reset]);

  const handleDocumentAction = useCallback(
    async (actionType: string, payload: any) => {
      const currentDocuments = documents || [];

      switch (actionType) {
        case "ADD": {
          const { files } = payload;
          const allowedExtensions = [
            ".png",
            ".jpeg",
            ".jpg",
            ".pdf",
            ".doc",
            ".txt",
            ".csv",
            ".docx",
            ".xls",
            ".xlsx",
            ".rtf",
          ];
          const MAX_FILE_SIZE = 5 * 1024 * 1024;

          const { validFiles, invalidFiles, oversizedFiles } = files.reduce(
            (acc: any, file: File) => {
              const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

              if (!allowedExtensions.includes(extension)) {
                acc.invalidFiles.push(file.name);
              } else if (file.size > MAX_FILE_SIZE) {
                acc.oversizedFiles.push(file.name);
              } else {
                acc.validFiles.push(file);
              }
              return acc;
            },
            { validFiles: [], invalidFiles: [], oversizedFiles: [] }
          );

          if (invalidFiles.length > 0) {
            showSnackbar(
              `Some files were rejected (${invalidFiles.join(
                ", "
              )}). Allowed types: ${allowedExtensions.join(", ")}`,
              "error"
            );
          }

          if (oversizedFiles.length > 0) {
            showSnackbar(
              `File exceeds the 5MB limit: ${oversizedFiles.join(", ")}`,
              "error"
            );
          }

          if (validFiles.length === 0) return;

          const processFiles = (files: File[]): Promise<DocumentType[]> => {
            const promises = files.map((file: File) => {
              return new Promise<DocumentType>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  resolve({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    dataUrl: e.target?.result as string,
                    documentType: "",
                    documentDate: null,
                  });
                };
                reader.readAsDataURL(file);
              });
            });
            return Promise.all(promises);
          };

          const newDocsData = await processFiles(validFiles);
          setValue("documents", [...currentDocuments, ...newDocsData], {
            shouldValidate: true,
          });
          break;
        }

        case "UPDATE": {
          const { index, field, value } = payload;
          const updatedDocuments = currentDocuments.map((doc: any, i: number) =>
            i === index ? { ...doc, [field]: value } : doc
          );
          setValue("documents", updatedDocuments, { shouldValidate: true });
          break;
        }

        case "REMOVE": {
          const { index } = payload;
          const updatedDocuments = currentDocuments.filter(
            (_: any, i: number) => i !== index
          );
          setValue("documents", updatedDocuments, { shouldValidate: true });
          break;
        }

        default:
          console.warn(`Unknown document action type: ${actionType}`);
      }
    },
    [setValue, documents, showSnackbar]
  );

  const onSubmit = useCallback(
    async (data: any) => {
      setLoading(true);
      try {
        const dataToSave = {
          ...data,
          id: entityData?.id,
          registrationExpiry:
            data.registrationExpiry instanceof Date
              ? data.registrationExpiry.toISOString()
              : null,
          documents: data.documents.map((doc: DocumentType) => ({
            ...doc,
            documentDate:
              doc.documentDate instanceof Date
                ? doc.documentDate.toISOString()
                : null,
          })),
        };

        await onSave(dataToSave);
        if (!isInline) onClose();
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to save vehicle", "error");
      } finally {
        setLoading(false);
      }
    },
    [entityData, isInline, onClose, onSave, showSnackbar]
  );

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <VehicleFormFields
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        documents={documents}
        handleDocumentAction={handleDocumentAction}
      />
      <VehicleFormActions
        onClose={onClose}
        handleSave={handleSubmit(onSubmit)}
        isInline={isInline}
        loading={loading} // <-- pass down
      />
    </form>
  );
});

export default VehicleForm;
