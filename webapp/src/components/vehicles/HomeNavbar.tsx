import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const HomeNavbar = () => {
  const { user } = useUser();
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const profileOpen = Boolean(profileAnchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) =>
    setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  return (
    <AppBar position="static" sx={{ bgcolor: "#002E4C", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 2 } }}>
        {/* Logo Section */}
        <Box>
          <Image
            src="/Vehicles-Images/AllotracLogo.png"
            alt="Allotrac Logo"
            height={65}
            width={220}
          />
        </Box>

        {/* Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {["FEATURES", "INDUSTRIES", "INTEGRATIONS", "ABOUT", "CONTACT"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                passHref
                style={{ textDecoration: "none" }} // prevent underline
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#E0F7FA",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#4FC3F7" },
                  }}
                >
                  {item}
                </Typography>
              </Link>
            )
          )}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Profile Avatar */}
          {user && (
            <>
              <Tooltip title="Profile" arrow>
                <Avatar
                  alt={user?.name || "User"}
                  src={user?.picture || "/Vehicles-Images/user-avatar.jpeg"}
                  sx={{ width: 35, height: 35, cursor: "pointer" }}
                  onClick={handleProfileClick}
                >
                  {user?.name?.charAt(0) || "M"}
                </Avatar>
              </Tooltip>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={profileAnchorEl}
                open={profileOpen}
                onClose={handleProfileClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleProfileClose}>
                  <Link
                    href="/user-lounge"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                  <Link
                    href="/api/auth/logout"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Logout
                  </Link>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HomeNavbar;
