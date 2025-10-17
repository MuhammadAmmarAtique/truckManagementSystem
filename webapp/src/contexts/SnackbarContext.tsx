import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type ShowArgs = {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
  action?: React.ReactNode;
};

type SnackbarContextType = {
  showSnackbar: (
    message: string,
    severity?: AlertColor,
    autoHideDuration?: number,
    action?: React.ReactNode
  ) => void;
  show: (args: ShowArgs) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx)
    throw new Error("useSnackbar must be used inside <SnackbarProvider>");
  return ctx;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [duration, setDuration] = useState<number | undefined>(4000);
  const [action, setAction] = useState<React.ReactNode | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => setOpen(false);

  const show = useCallback((args: ShowArgs) => {
    setMessage(args.message);
    setSeverity(args.severity ?? "info");
    setDuration(args.autoHideDuration ?? 4000);
    setAction(args.action ?? null);
    setOpen(true);
  }, []);

  const showSnackbar = useCallback(
    (
      message: string,
      severity: AlertColor = "info",
      autoHideDuration?: number,
      action?: React.ReactNode
    ) => show({ message, severity, autoHideDuration, action }),
    [show]
  );

  const value = useMemo(() => ({ showSnackbar, show }), [showSnackbar, show]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={duration}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isSmallScreen ? "center" : "left",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
          action={action}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
