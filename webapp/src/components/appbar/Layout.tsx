// Layout component: wraps all pages with an AppBar at the top.
// When the sidebar (inside AppBar) opens, it shifts the main content to the right.
import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material"; // Import useMediaQuery and useTheme
import Appbar from "./Appbar";

const drawerWidth = 260;
const mobileBreakpoint = "md";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(mobileBreakpoint)); // True if screen is 'md' or larger

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentMargin = sidebarOpen && isDesktop ? `${drawerWidth}px` : 0;

  return (
    <Box>
      <Appbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Box
        component="main"
        sx={{
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: mainContentMargin,
          paddingTop: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
