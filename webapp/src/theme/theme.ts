import { createTheme } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { Inter } from "next/font/google";

export const inter = Inter({
  weight: ["500", "700"],
  subsets: ["latin"],
});

const sharedTypography = {
  fontFamily: `${inter.style.fontFamily}, Roboto, Helvetica, Arial, sans-serif`,
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
};

export const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 770, md: 850, lg: 1200, xl: 1536 },
  },
  palette: {
    background: { default: "#4492c629" },
    primary: { main: "#4492c6" },
    secondary: { main: "#7a656dff" },
  },
  typography: sharedTypography,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#012d44ff", paper: "#00263a" },
    primary: { main: "#4199d3ff" },
    text: { primary: "#ffffff", secondary: "#b1c0c7ff" },
  },
  typography: sharedTypography,
});

export const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));
