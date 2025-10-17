import React, { useState, useRef } from "react";
import { Document, Vehicle } from "@/entities/types/vehicleTypes";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  IconButton,
  Avatar,
  Grid,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Backdrop,
  CircularProgress, // Added for the loading spinner
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";
import AddVehicleForm from "./AddVehicleForm";
import ConfirmationDialog from "./ConfirmationDialog";
import DetailSection from "./DetailSection";
import DocumentsSection from "./DocumentsSection";
import {
  getVehicleAvatarInitial,
  getVehicleColor,
} from "@/utils/vehicleContants";
import { VEHICLE_FIELDS } from "@/config/vehicleFieldsConfig";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface VehicleDetailsProps {
  vehicle: Vehicle | null;
  onEditVehicle: (updatedVehicleData: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  vehicleColor?: string;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  vehicle,
  vehicleColor,
  onEditVehicle,
  onDeleteVehicle,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const addVehicleFormRef = useRef<{ submit: () => void }>(null);
  // State to control the loading spinner visibility
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleEditClick = () => setIsEditing(true);
  const handleDeleteClick = () => setIsConfirmDialogOpen(true);

  const handleConfirmDelete = async () => {
    if (vehicle) {
      setIsLoading(true);
      try {
        await onDeleteVehicle(vehicle.id as string);
      } finally {
        setIsLoading(false);
        setIsConfirmDialogOpen(false);
      }
    }
  };

  const handleFormSave = async (updatedVehicleData: Vehicle) => {
    setIsLoading(true);
    try {
      await onEditVehicle(updatedVehicleData);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleCancelDelete = () => setIsConfirmDialogOpen(false);
  const handleFormClose = () => setIsEditing(false);

  const handleInlineSaveClick = () => {
    // Trigger the form submission via the ref, which will in turn call handleFormSave
    addVehicleFormRef.current?.submit();
  };

  const handleDocumentClick = (doc: Document) => {
    setCurrentDocument(doc);
    setIsDocumentViewerOpen(true);
  };

  const handleCloseDocumentViewer = () => {
    setIsDocumentViewerOpen(false);
    setCurrentDocument(null);
  };

  const handleDownloadDocument = () => {
    if (currentDocument) {
      const link = document.createElement("a");
      link.href = currentDocument.dataUrl ?? "";
      link.download = currentDocument.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!vehicle) {
    return (
      <Box
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Select a vehicle to view details.
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                bgcolor: vehicleColor || getVehicleColor(0),
                mr: 1,
                color: "white",
              }}
            >
              {getVehicleAvatarInitial(vehicle)}
            </Avatar>
            <Typography variant="body1">
              {vehicle.identifier || "---"}
            </Typography>
          </Box>
          <Box>
            {isEditing ? (
              <>
                <Button
                  onClick={handleFormClose}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, py: 1 }}
                >
                  <Typography variant="body2">Cancel</Typography>
                </Button>
                <Button
                  onClick={handleInlineSaveClick}
                  variant="contained"
                  size="small"
                  sx={{ py: 1 }}
                  color="primary"
                >
                  <Typography variant="body2">Save</Typography>
                </Button>
              </>
            ) : (
              <>
                {isMdUp ? (
                  <Button
                    variant="outlined"
                    size="medium"
                    color="error"
                    sx={{ mr: 1, py: 1 }}
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                  >
                    <Typography variant="body2">Delete</Typography>
                  </Button>
                ) : (
                  <IconButton color="error" onClick={handleDeleteClick}>
                    <DeleteIcon />
                  </IconButton>
                )}
                {isMdUp ? (
                  <Button
                    variant="outlined"
                    size="medium"
                    sx={{ py: 1 }}
                    startIcon={<CreateIcon />}
                    onClick={handleEditClick}
                  >
                    <Typography variant="body2">Edit</Typography>
                  </Button>
                ) : (
                  <IconButton color="primary" onClick={handleEditClick}>
                    <CreateIcon />
                  </IconButton>
                )}
              </>
            )}
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
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
          {isEditing ? (
            <AddVehicleForm
              ref={addVehicleFormRef}
              open={true}
              onClose={handleFormClose}
              onSave={handleFormSave}
              entityData={vehicle}
              isInline={true}
            />
          ) : (
            <Grid container spacing={0.5} justifyContent="center">
              {VEHICLE_FIELDS.map((field) => {
                // If the field is 'documents', render the specialized DocumentsSection
                if (field.key === "documents") {
                  return (
                    <DetailSection
                      key={field.key}
                      label={field.label}
                      value={
                        <DocumentsSection
                          documents={vehicle.documents ?? []}
                          onDocumentClick={handleDocumentClick}
                        />
                      }
                    />
                  );
                }
                // Otherwise, render the standard DetailSection
                return (
                  <DetailSection
                    key={field.key}
                    label={field.label}
                    value={field.formatter?.(vehicle[field.key as keyof Vehicle])}
                  />
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Confirmation */}
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete Vehicle ${vehicle?.identifier || "this vehicle"
          }?`}
      />

      {/* Document Viewer */}
      <Dialog
        open={isDocumentViewerOpen}
        onClose={handleCloseDocumentViewer}
        fullWidth
        maxWidth="lg"
        fullScreen={!isMdUp}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDocumentViewer}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {currentDocument?.name || "Document Viewer"}
            </Typography>
            {currentDocument && (
              <Button
                color="inherit"
                onClick={handleDownloadDocument}
                startIcon={<GetAppIcon />}
              >
                Download
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0 }}>
          {currentDocument ? (
            currentDocument.type.startsWith("image/") ? (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={currentDocument.dataUrl ?? ""}
                  alt={currentDocument.name}
                  style={{ maxWidth: "100%" }}
                />
              </Box>
            ) : currentDocument.type === "application/pdf" ? (
              <iframe
                src={currentDocument.dataUrl ?? ""}
                title={currentDocument.name}
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            ) : currentDocument.type.includes("text/plain") ? (
              <Box sx={{ p: 2, overflow: "auto" }}>
                {(() => {
                  let decodedText = "";
                  try {
                    const base64Content =
                      currentDocument.dataUrl?.split(",")[1] ?? "";
                    decodedText = atob(base64Content);
                  } catch (e) {
                    console.error("Error decoding base64 content:", e);
                    decodedText = "Failed to load document content.";
                  }
                  return <Typography variant="body2">{decodedText}</Typography>;
                })()}
              </Box>
            ) : (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  No viewer for this file type.
                </Typography>
              </Box>
            )
          ) : (
            <Typography sx={{ p: 2 }}>No document selected.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default VehicleDetails;