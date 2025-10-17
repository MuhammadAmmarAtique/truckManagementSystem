import React from "react";
import { Button, DialogActions, CircularProgress } from "@mui/material";

interface VehicleFormActionsProps {
  onClose: () => void;
  handleSave: () => void;
  isInline?: boolean;
  loading?: boolean;
}

export default function VehicleFormActions({
  onClose,
  handleSave,
  isInline = false,
  loading = false,
}: VehicleFormActionsProps) {
  if (isInline) return null;

  return (
    <DialogActions
      sx={{
        px: 2,
        py: 1,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "background.secondary",
        borderTop: "1px solid",
        borderColor: "divider",
        zIndex: 1200,
      }}
    >
      <Button
        onClick={onClose}
        variant="outlined"
        size="medium"
        disabled={loading}
      >
        CANCEL
      </Button>
      <Button
        onClick={handleSave}
        variant="contained"
        color="primary"
        size="medium"
        disabled={loading}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : "SAVE"}
      </Button>
    </DialogActions>
  );
}
