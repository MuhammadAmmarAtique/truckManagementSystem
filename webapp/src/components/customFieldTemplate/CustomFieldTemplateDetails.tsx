import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  IconButton,
  Avatar,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { ICustomFieldTemplate } from "@/entities/types/customFieldTemplateTypes";
import DetailSection from "../vehicles/DetailSection";

interface Props {
  field?: ICustomFieldTemplate;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CustomFieldTemplateDetails({
  field,
  onEdit,
  onDelete,
}: Props) {
  const [selectedTab, setSelectedTab] = useState(0);

  if (!field) {
    return (
      <Box
        sx={{
          p: 2,
          height: "75vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#00000056",
        }}
      >
        <Typography>
          Please create Custom Field Template to show details.
        </Typography>
      </Box>
    );
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        mt: -7,
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "#003B5C", mr: 1, color: "white" }}>
            {field.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body1">{field.name || "---"}</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            size="medium"
            color="error"
            sx={{ mr: 1, py: 1 }}
            startIcon={<DeleteIcon />}
            onClick={onDelete}
          >
            <Typography variant="body2">Delete</Typography>
          </Button>
          <Button
            variant="outlined"
            size="medium"
            sx={{ py: 1 }}
            startIcon={<CreateIcon />}
            onClick={onEdit}
          >
            <Typography variant="body2">Edit</Typography>
          </Button>
        </Box>
      </Stack>

      <Divider
        sx={(theme) => ({
          borderColor: theme.palette.mode === "dark" ? "#505050ff" : "#ddd",
        })}
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "transparent", mb: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="DETAILS" value={0} />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, mt: 2 }}>
        <Grid container spacing={0.5} justifyContent="center">
          <DetailSection label="Name" value={field.name} />
          <DetailSection label="Type" value={field.type} />
          <DetailSection
            label="System Visibility"
            value={field.systemVisibility}
          />
          <DetailSection
            label="Driver Visibility"
            value={field.driverVisibility}
          />
          <DetailSection
            label="Required Stage"
            value={field.requiredStage || "---"}
          />
          <DetailSection
            label="Replicate"
            value={field.replicate ? "Yes" : "No"}
          />
        </Grid>
      </Box>
    </Box>
  );
}
