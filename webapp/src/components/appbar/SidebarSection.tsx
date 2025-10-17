import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface SidebarItem {
  label: string;
  path?: string;
  disabled?: boolean;
}

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  items: SidebarItem[];
  onItemClick: (path?: string) => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  items,
  onItemClick,
}) => {
  return (
    <Accordion
      disableGutters
      sx={{
        borderBottom: "none",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 2,
          "& .MuiAccordionSummary-content": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          {icon}
        </Box>

        <Typography sx={{ flex: 2, textAlign: "center", fontWeight: 500 }}>
          {title}
        </Typography>

        <Box sx={{ flex: 1 }} />
      </AccordionSummary>

      <AccordionDetails
        sx={{
          maxHeight: 250,
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#aaa",
          },
        }}
      >
        <List>
          {items.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => onItemClick(item.path)}
              disabled={item.disabled}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default SidebarSection;
