import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "10px",
            px: 1,
            py: 1,
            minWidth: 400,
          },
        },
      }}
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          fontSize: "1.3rem",
          paddingBottom: 0.7,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ paddingTop: "4px" }}>
        <Typography
          id="confirmation-dialog-description"
          color="text.secondary"
          variant="body2"
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ pb: 2 }}>
        <Button
          onClick={() => onClose(false)}
          variant="outlined"
          sx={{
            color: "rgba(0, 0, 0, 0.87)",
            borderColor: "rgba(0, 0, 0, 0.32)",
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.6)",
              backgroundColor: "rgba(0, 0, 0, 0.03)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            backgroundColor: "rgb(244, 67, 54)",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#ad3131ff",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
