import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

interface VehicleFiltersProps {
  onOpenForm: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({ onOpenForm }) => {
  const commonSx = {
    textTransform: "none",
    px: 2,
    width: { xs: "70%", sm: "100%" },
    justifyContent: "flex-start",
    "& .MuiButton-startIcon > *": {
      fontSize: 24,
    },
  };

  return (
    <Stack alignItems="center" spacing={0}>
      <Button
        variant="contained"
        onClick={onOpenForm}
        fullWidth
        sx={{
          width: { xs: "70%", sm: "100%" },
          textTransform: "uppercase",
        }}
        aria-label="Add new vehicle"
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            p: 0.4,
            color: "#fff",
          }}
        >
          Add Vehicle
        </Typography>
      </Button>

      <Button
        variant="text"
        startIcon={
          <MoveToInboxIcon
            sx={(theme) => ({
              color:
                theme.palette.mode === "dark"
                  ? "#ffffff"
                  : "rgba(0, 0, 0, 0.54)",
            })}
          />
        }
        sx={{
          ...commonSx,
          pt: 2,
        }}
        aria-label="View licensed vehicles"
      >
        <Typography variant="body2" color="textPrimary" sx={{ pl: 2 }}>
          Licensed
        </Typography>
      </Button>

      {/* Available Vehicles */}
      <Button
        variant="text"
        startIcon={
          <MarkEmailUnreadIcon
            sx={(theme) => ({
              color:
                theme.palette.mode === "dark"
                  ? "#ffffff"
                  : "rgba(0, 0, 0, 0.54)",
            })}
          />
        }
        sx={{
          ...commonSx,
          pt: 1,
        }}
        aria-label="View available vehicles"
      >
        <Typography variant="body2" color="textPrimary" sx={{ pl: 2 }}>
          Available
        </Typography>
      </Button>
    </Stack>
  );
};

export default VehicleFilters;
