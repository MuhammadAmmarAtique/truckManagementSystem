import React from "react";
import { Typography, TextField, Box, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, useFormContext } from "react-hook-form";
import type IJobFormState from "@/entities/types/jobTypes";
import dayjs from "dayjs";
import { useFormDisable } from "@/contexts/FormDisableContext";

//  Only allowing today or future dates

const today = dayjs().startOf("day").toDate(); // sets time to 00:00:00.000

const JobDetails: React.FC = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<IJobFormState>();

  const disableAllExceptReference = useFormDisable();
  const getDisabled = (field: string) =>
    disableAllExceptReference && field !== "jobReference";

  return (
    <Box sx={{ border: "1px solid #ddd", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Job Details
      </Typography>

      <Grid container spacing={2}>
        {/*  Job Reference */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2">Job Reference:</Typography>
          <TextField
            size="small"
            placeholder="job reference"
            InputProps={{
              sx: {
                "& input::placeholder": {
                  fontSize: "0.85rem",
                  color: "#888",
                  opacity: 1,
                },
              },
            }}
            fullWidth
            {...register("jobReference", {
              setValueAs: (value) => (value ?? "").trim(), // trim leading/trailing spaces
              validate: (value) =>
                (value ?? "").trim() !== "" ||
                "Job reference cannot be empty or spaces only",
            })}
            disabled={false}
            error={!!errors.jobReference}
            helperText={errors.jobReference?.message}
          />
        </Grid>

        {/* Job Date */}

        <Grid size={{ xs: 12 }}>
          <Typography variant="body2">
            Job Date: <span style={{ color: "red" }}>*</span>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="jobDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value || null}
                  onChange={(date) => {
                    if (!date) {
                      field.onChange(null);
                      return;
                    }
                    //  Prevent selecting or typing past dates
                    const selected = dayjs(date).startOf("day").toDate();
                    if (selected < today) {
                      field.onChange(today);
                    } else {
                      field.onChange(selected);
                    }
                  }}
                  minDate={today}
                  format="MM/dd/yyyy"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: !!errors.jobDate,
                      helperText: errors.jobDate?.message,
                    },
                  }}
                  disabled={getDisabled("jobDate")}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetails;
