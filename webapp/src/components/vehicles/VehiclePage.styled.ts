import { styled } from "@mui/material/styles";
import { Box, Grid, GridProps, Paper, BoxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { CSSObject } from "@emotion/react";

// Alternative: Hover-only scrollbar (more complex but works)
export const createScrollbarStyles = (theme: Theme): CSSObject => ({
  // Hide scrollbar by default
  "&::-webkit-scrollbar": {
    width: "0px",
    height: "0px",
    background: "transparent",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "transparent",
  },

  // Firefox - hide by default
  scrollbarWidth: "none" as const,
  scrollbarColor: "transparent transparent",

  // Show on hover - this targets the scrollable container
  "&:hover": {
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
      background: "transparent",
    },
    "&::-webkit-scrollbar-track": {
      background:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.05)",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      background:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(0, 0, 0, 0.3)",
      borderRadius: "3px",

      "&:hover": {
        background:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },

    // Firefox - show on hover
    scrollbarWidth: "thin" as const,
    scrollbarColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.05)",
  },

  scrollBehavior: "smooth" as const,
});

// ✅ PROPER TYPING - Corrected code
export const MainContainer = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(1),
  height: "calc(100vh - 80px)",
  overflow: "auto",
  backgroundColor: theme.palette.mode === "dark" ? "#00263a" : "#ffffff",
  borderRadius: "8px",
  boxShadow: theme.shadows[2],
  ...createScrollbarStyles(theme),
}));

export const GridContainer = styled(Grid)(() => ({
  height: "100%",
  width: "auto",
}));

export const FilterColumn = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  borderRight: "none",
  borderBottom: "1px solid #ddd",
  height: "auto",
  overflowY: "auto",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(2),
    borderRight: `1px solid ${
      theme.palette.mode === "dark" ? "#505050ff" : "#ddd"
    }`,
    borderBottom: "none",
    height: "100%",
  },
  ...createScrollbarStyles(theme),
}));

export const VehicleListColumn = styled(Grid)(
  ({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(2),
    borderRight: "none",
    borderBottom: "1px solid #ddd",
    height: "auto",
    overflowY: "auto",

    [theme.breakpoints.up("sm")]: {
      borderRight: `1px solid ${
        theme.palette.mode === "dark" ? "#505050ff" : "#ddd"
      }`,
      borderBottom: "none",
      height: "100%",
    },
    ...createScrollbarStyles(theme),
  })
);

export const DetailsColumn = styled(Grid)<GridProps>(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  overflowY: "auto",
  ...createScrollbarStyles(theme),
}));

export const ColumnPaper = styled(Paper)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));
