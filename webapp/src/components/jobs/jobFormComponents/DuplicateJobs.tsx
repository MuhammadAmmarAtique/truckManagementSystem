import React from "react";
import { Typography, TextField, Box, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";

const DuplicateJobs: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Box sx={{ border: "1px solid #ddd", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Duplicate Jobs
      </Typography>

      <Typography variant="body2">No of Jobs:</Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12 }}>
          <TextField
            type="text"
            fullWidth
            size="small"
            placeholder="Number of jobs (e.g: 5)"
            InputProps={{
              sx: {
                "& input::placeholder": {
                  fontSize: "0.85rem",
                  color: "#888",
                  opacity: 1,
                },
              },
            }}
            defaultValue={1}
            error={!!errors.duplicateCount}
            helperText={
              typeof errors.duplicateCount?.message === "string"
                ? errors.duplicateCount.message
                : ""
            }
            {...register("duplicateCount")}
            onKeyDown={(e) => {
              const value = (e.target as HTMLInputElement).value;

              // Block non-digits except control keys
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }

              // Block leading zero
              if (e.key === "0" && value.length === 0) {
                e.preventDefault();
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DuplicateJobs;
