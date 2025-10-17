// Same jobForm will be used for creating and editing jobs.
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, FormProvider } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";

import type IJobFormState from "@/entities/types/jobTypes";
import { jobValidationSchema } from "@/entities/validation/jobValidationSchema";
import JobDetails from "./JobDetails";
import JobConfiguration from "./JobConfiguration";
import JobRoute from "./JobRoute";
import Items from "./Items";
import DuplicateJobs from "./DuplicateJobs";
import Documents from "./Documents";
import { useJobs } from "@/contexts/JobsContext";
import { FormDisableContext } from "@/contexts/FormDisableContext";
import Loader from "@/components/common/Loader";

interface JobFormProps {
  open?: boolean;
  onClose?: () => void;
  initialDataForEdit?: IJobFormState;
  isEdit?: boolean;
  asPage?: boolean;
  disableAllExceptReference?: boolean;
}

const defaultValues: IJobFormState = {
  jobReference: "",
  jobDate: dayjs().toDate(),
  jobType: "Pickup and Delivery",
  paymentType: "cod",
  fleet: "",
  shift: "",
  deliveryType: "",
  rollover: false,
  customFieldGroup: "",
  billable: "",
  pickupFrom: "",
  deliverTo: "",
  pickupLocation: null,
  deliverLocation: null,
  selectedItem: "",
  orderQty: null,
  primaryUnit: "",
  itemsList: [],
  duplicateCount: null,
  documents: [],
  jobStatus: "idle",
};

const JobForm: React.FC<JobFormProps> = ({
  open = false,
  onClose = () => {},
  initialDataForEdit,
  isEdit = false,
  asPage = false,
  disableAllExceptReference = false,
}) => {
  const { addJob, updateJob } = useJobs();

  // loading state for loader
  const [loading, setLoading] = useState(false);

  const methods = useForm<IJobFormState>({
    defaultValues,
    resolver: yupResolver(jobValidationSchema),
    context: { isEdit },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Prefill when editing
  useEffect(() => {
    if (initialDataForEdit) {
      const fixedData: IJobFormState = {
        ...initialDataForEdit,
        jobDate: initialDataForEdit.jobDate
          ? dayjs(initialDataForEdit.jobDate).toDate()
          : null,
        pickupLocation:
          typeof initialDataForEdit.pickupLocation === "object"
            ? initialDataForEdit.pickupLocation
            : null,
        deliverLocation:
          typeof initialDataForEdit.deliverLocation === "object"
            ? initialDataForEdit.deliverLocation
            : null,
      };
      reset(fixedData);
    } else {
      reset(defaultValues);
    }
  }, [initialDataForEdit, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose?.();
  };

  const onSubmit: SubmitHandler<IJobFormState> = async (data) => {
    setLoading(true);

    try {
      console.log("data going to backend:::::", data);
      const count = data.duplicateCount ?? 1;

      if (isEdit) {
        await updateJob(data);
      } else {
        const newJobs = Array.from({ length: count }).map(() => ({
          ...data,
        }));
        await addJob(newJobs);
      }

      handleClose();
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logging validation errors for debugging
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

  // Disable buttons while loading
  const submitButtonDisabled = loading;

  // Inline Render asPage in case of Editing Job

  if (asPage) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Edit Job" : "Add Job"}
        </Typography>
        <FormDisableContext.Provider value={disableAllExceptReference}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ my: 2 }}>
                <JobDetails />
              </Box>
              <Box sx={{ my: 2 }}>
                <JobConfiguration />
              </Box>
              <Box sx={{ my: 2 }}>
                <JobRoute isEdit={isEdit} />
              </Box>
              <Box sx={{ my: 2 }}>
                <Items />
              </Box>
              {!isEdit && (
                <Box sx={{ my: 2 }}>
                  <DuplicateJobs />
                </Box>
              )}
              <Box sx={{ my: 2 }}>
                <Documents />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  disabled={submitButtonDisabled}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitButtonDisabled}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </Box>
            </form>
          </FormProvider>
        </FormDisableContext.Provider>
        {/* Global Loader */}
        <Loader open={loading} color="primary" />
      </Paper>
    );
  }

  // Default Dialog Render in case of Creating Job

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={(event, reason) => {
        if (
          isEdit &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        ) {
          return;
        }
        handleClose();
      }}
      fullScreen={isEdit}
      hideBackdrop={isEdit}
      sx={
        isEdit ? { mt: "69px", zIndex: (theme) => theme.zIndex.drawer - 1 } : {}
      }
      slotProps={{
        backdrop: isEdit ? { invisible: true } : undefined,
        paper: !isEdit
          ? {
              sx: {
                width: "80vw",
                maxWidth: "900px",
                maxHeight: "86vh",
                p: 2,
                borderRadius: 3,
              },
            }
          : undefined,
      }}
    >
      {!isEdit && (
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 0,
            fontWeight: 400,
          }}
        >
          Add Job
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              ml: 2,
              color: "text.secondary",
              borderRadius: "50%",
              transition: "background-color 0.2s ease",
              ":hover": { color: "text.primary" },
            }}
            disabled={submitButtonDisabled}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent sx={isEdit ? null : { p: 0 }}>
        {/* FormProvider makes RHF context available to all children */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ my: 2 }}>
              <JobDetails />
            </Box>
            <Box sx={{ my: 2 }}>
              <JobConfiguration />
            </Box>
            <Box sx={{ my: 2 }}>
              <JobRoute isEdit={isEdit} />
            </Box>
            <Box sx={{ my: 2 }}>
              <Items />
            </Box>
            {!isEdit && (
              <Box sx={{ my: 2 }}>
                <DuplicateJobs />
              </Box>
            )}
            <Box sx={{ my: 2 }}>
              <Documents />
            </Box>
            <DialogActions>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={submitButtonDisabled}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitButtonDisabled}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </DialogContent>

      {/* Loader when saving */}
      <Loader open={loading} color="primary" />
    </Dialog>
  );
};

export default JobForm;
