import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import VehicleForm from "./VehicleForm";
import { Vehicle } from "@/entities/types/vehicleTypes";

interface AddVehicleProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Vehicle) => void;
  entityData?: Vehicle | null; // Corrected: Allows null as a valid type
  isInline?: boolean;
  existingIdentifiers?: string[];
  existingLicencePlates?: string[]; // Added: Prop was missing from the interface
}

const AddVehicleForm = forwardRef(
  (
    {
      open,
      onClose,
      onSave,
      entityData = null,
      isInline = false,
      existingIdentifiers = [],
      existingLicencePlates = [],
    }: AddVehicleProps,
    ref
  ) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const formRef = useRef<{ submit: () => void }>(null);

    useImperativeHandle(ref, () => ({
      submit: () => formRef.current?.submit(),
    }));

    const formContent = (
      <VehicleForm
        ref={formRef}
        onClose={onClose}
        onSave={onSave}
        entityData={entityData}
        isInline={isInline}
        existingIdentifiers={existingIdentifiers}
        existingLicencePlates={existingLicencePlates}
      />
    );

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {isInline ? (
          <Box sx={{ height: "100%", overflowY: "auto" }}>{formContent}</Box>
        ) : (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ p: 2 }}>
              {entityData ? "Edit Vehicle" : "Add Vehicle"}
            </DialogTitle>

            <Divider />

            <Box sx={{ px: 2 }}>
              <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
                <Tab label="DETAILS" value={0} />
              </Tabs>
            </Box>
            <DialogContent sx={{ mb: 6 }}>{formContent}</DialogContent>
          </Dialog>
        )}
      </LocalizationProvider>
    );
  }
);

export default AddVehicleForm;
