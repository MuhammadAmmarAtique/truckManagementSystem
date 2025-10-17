import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { addDays } from "date-fns";
import VehicleCard from "./VehicleCard";

interface VehiclesScreenProps {
  vehicles: any[];
  onStartShift: (vehicle: any) => void;
  getRandomTimeToday: () => Date;
  startingShiftVehicleId?: string | null;
}

const VehiclesScreen: React.FC<VehiclesScreenProps> = ({
  vehicles,
  onStartShift,
  getRandomTimeToday,
  startingShiftVehicleId,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#00263A",
        minHeight: "80vh",
        padding: 3,
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          marginBottom: 3,
        }}
      >
        <Typography variant="h5">Shift Details</Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#64A5D7", color: "white" }}
        >
          NEW SHIFT
        </Button>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={3} justifyContent="center">
        {vehicles?.map((vehicle: any) => {
          const startTime = new Date();
          const endTime = addDays(new Date(), 1);

          return (
            <Grid size={{ xs: 12, md: 9 }} key={vehicle.id}>
              <VehicleCard
                vehicle={vehicle}
                startTime={startTime}
                endTime={endTime}
                onStartShift={onStartShift}
                isStarting={startingShiftVehicleId === vehicle.id} // 👈 PASS LOADER FLAG
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default VehiclesScreen;
