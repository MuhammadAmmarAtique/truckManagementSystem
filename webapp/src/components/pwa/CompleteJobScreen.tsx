import React from "react";
import { Box, IconButton, Button, CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

interface Job {
  id: string;
  jobReference?: string | null;
  pickupLocation?: { value: string; label: string } | null;
  deliverLocation?: { value: string; label: string } | null;
  orderQty?: number;
}

interface CompleteJobScreenProps {
  activeJob: Job;
  onBack: () => void;
  onCompleteJob: (job: Job) => void;
  completingJobId?: string | null;
}

const CompleteJobScreen: React.FC<CompleteJobScreenProps> = ({
  activeJob,
  onBack,
  onCompleteJob,
  completingJobId,
}) => {
  const isCompleting = completingJobId === activeJob.id;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "90vh",
        p: 3,
        color: "white",
        backgroundImage: `url("/PWA-Images/sydney.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            color: "black",
            "&:hover": {
              color: "#333",
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
          size="large"
        >
          <ArrowBack />
        </IconButton>
      </Box>

      {/* Complete Job Button */}
      <Box
        sx={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={() => onCompleteJob(activeJob)}
          disabled={isCompleting}
          sx={{
            backgroundColor: "#64A5D7",
            color: "white",
            px: 4,
            py: 1.5,
            minWidth: 160,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#4c8bbd",
            },
          }}
        >
          {isCompleting ? (
            <CircularProgress size={22} sx={{ color: "white" }} />
          ) : (
            "Complete JOB"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CompleteJobScreen;
