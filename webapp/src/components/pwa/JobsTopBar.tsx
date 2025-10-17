import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

interface Job {
  id: string;
  jobReference?: string | null;
  pickupLocation?: { value: string; label: string } | null;
  deliverLocation?: { value: string; label: string } | null;
  orderQty?: number;
}
interface JobsTopBarProps {
  onBack: () => void;
  jobs?: Job[];
}

const JobsTopBar: React.FC<JobsTopBarProps> = ({ onBack, jobs }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      justifyContent: "center",
      position: "relative",
      mb: 3,
    }}
  >
    <IconButton
      onClick={onBack}
      sx={{ position: "absolute", left: 8, top: -8, color: "white" }}
      size="large"
    >
      <ArrowBack />
    </IconButton>
    {jobs && jobs.length > 0 && (
      <Typography variant="body1" color="white">
        Swipe job to start
      </Typography>
    )}
  </Box>
);

export default JobsTopBar;
