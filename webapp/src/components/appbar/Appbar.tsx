import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  Button,
  useMediaQuery,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShareIcon from "@mui/icons-material/Share";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import JobForm from "@/components/jobs/jobFormComponents/JobForm";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import CreateIcon from "@mui/icons-material/Create";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { sidebarSections } from "@/utils/jobConstants";
import SidebarSection from "./SidebarSection";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useThemeContext } from "@/contexts/ThemeContext";
import Loader from "@/components/common/Loader"; 

interface AppbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Appbar: React.FC<AppbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [avatarMenuEl, setAvatarMenuEl] = useState<null | HTMLElement>(null);
  const [isJobFormLoading, setIsJobFormLoading] = useState(false);

  const { user, isLoading } = useUser();
  const router = useRouter();
  const isDropdownOpen = Boolean(anchorEl);
  const isAvatarMenuOpen = Boolean(avatarMenuEl);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { setDarkMode } = useThemeContext();

  // Dropdown logic
  const handleToggleDropdown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(isDropdownOpen ? null : event.currentTarget);
  };
  const handleCloseDropdown = () => setAnchorEl(null);
  const handleOpenJobModal = () => {
    handleCloseDropdown();
    setIsJobFormLoading(true);

    setTimeout(() => {
      setIsJobFormOpen(true);
      setIsJobFormLoading(false);
    }, 300);
  };
  const handleCloseJobModal = () => setIsJobFormOpen(false);

  const handleSidebarItemClick = (path?: string) => {
    setSidebarOpen(false);
    if (path) router.push(path);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarMenuEl(event.currentTarget);
  };
  const handleAvatarMenuClose = () => setAvatarMenuEl(null);

  const getSectionIcon = (title: string) => {
    switch (title) {
      case "Operate":
        return <ManageSearchIcon />;
      case "Track":
        return <MyLocationIcon />;
      case "Finance":
        return <MonetizationOnIcon />;
      case "Analyze":
        return <FindInPageIcon />;
      case "Manage":
        return <CreateIcon />;
      case "Configure":
        return <RoomPreferencesIcon />;
      default:
        return null;
    }
  };

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#00263A",
          borderBottom: "5px solid #F57C00",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Left Menu Icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link href="/" passHref legacyBehavior>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={
                    isMobile
                      ? "/Jobs-Images/Logo.png"
                      : "/Jobs-Images/allotracLogo.png"
                  }
                  alt="Allotrac Logo"
                  width={isMobile ? 60 : 200}
                  height={60}
                  priority
                />
              </Box>
            </Link>

            {/* Create New Dropdown */}
            <Button
              onClick={handleToggleDropdown}
              sx={{
                color: "white",
                fontWeight: 350,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                minWidth: "auto",
                px: isMobile ? 1 : 2,
              }}
              endIcon={isDropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {!isMobile && "CREATE NEW"}
            </Button>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={isDropdownOpen}
              onClose={handleCloseDropdown}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={handleOpenJobModal}>Jobs</MenuItem>
              <MenuItem disabled>Projects</MenuItem>
            </Menu>

            {/* Job Form Modal */}
            <JobForm open={isJobFormOpen} onClose={handleCloseJobModal} />
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right Side Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 1 : 1,
            }}
          >
            <Button
              sx={{ color: "#57abe4ff", textTransform: "none" }}
              startIcon={<ShareIcon />}
            >
              {!isMobile && "SHARE PAGE"}
            </Button>

            <Tooltip title="Toggle Mode" arrow>
              <IconButton
                aria-label="Toggle dark mode"
                onClick={handleDarkModeToggle}
              >
                <DarkModeIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="https://static.allotrac.com.au/allie/logo.png"
                alt="Logo"
                style={{ width: "80%", height: "80%", objectFit: "contain" }}
              />
            </Box>

            <Tooltip title="Chat" arrow>
              <ChatIcon sx={{ color: "white", cursor: "pointer" }} />
            </Tooltip>

            <Tooltip title="Notifications" arrow>
              <NotificationsIcon sx={{ color: "white", cursor: "pointer" }} />
            </Tooltip>

            {!isLoading && user && (
              <>
                <IconButton onClick={handleAvatarClick}>
                  <Avatar
                    alt={user?.nickname || "User"}
                    src={user?.picture || undefined}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>

                {/* Avatar Dropdown Menu */}
                <Menu
                  anchorEl={avatarMenuEl}
                  open={isAvatarMenuOpen}
                  onClose={handleAvatarMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    component={Link}
                    href="/user-lounge"
                    onClick={handleAvatarMenuClose}
                  >
                    User Lounge
                  </MenuItem>
                  <MenuItem component={Link} href="/api/auth/logout">
                    Log Out
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        variant="persistent"
        PaperProps={{ style: { width: 260, marginTop: "64px" } }}
      >
        <Box
          sx={{ mt: 2, pb: 0, mb: 0, boxShadow: "none", overflow: "hidden" }}
        >
          {sidebarSections.map((section) => (
            <SidebarSection
              key={section.title}
              title={section.title}
              icon={getSectionIcon(section.title)}
              items={section.items}
              onItemClick={handleSidebarItemClick}
            />
          ))}
        </Box>
      </Drawer>

      {/* Reusable Loader */}
      <Loader open={isJobFormLoading} />
    </Box>
  );
};

export default Appbar;
