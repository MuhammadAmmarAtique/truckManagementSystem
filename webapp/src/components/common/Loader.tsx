import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface LoaderProps {
  open: boolean;
  zIndex?: number;
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const Loader: React.FC<LoaderProps> = ({ open, zIndex, color = "inherit" }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: zIndex || ((theme) => theme.zIndex.drawer + 2) }}
      open={open}
    >
      <CircularProgress color={color} />
    </Backdrop>
  );
};

export default Loader;
