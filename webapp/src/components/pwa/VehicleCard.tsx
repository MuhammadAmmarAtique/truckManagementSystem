import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";

interface VehicleCardProps {
  vehicle: any;
  startTime: Date;
  endTime: Date;
  onStartShift: (vehicle: any) => void;
  isStarting?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  startTime,
  endTime,
  onStartShift,
  isStarting,
}) => {
  return (
    <Card
      sx={{
        backgroundColor: "#64A5D7",
        borderRadius: "20px",
        color: "white",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          DefaultShift
        </Typography>

        {/* Label-Value Layout */}
        <Grid container spacing={1}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300}>
              Site Name:
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300} align="right">
              allotrac
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300}>
              Vehicle Identifier:
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300} align="right">
              {vehicle.identifier}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300}>
              Fleet:
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300} align="right">
              {vehicle.fleets}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300}>
              Vehicle Class:
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300} align="right">
              {vehicle.vehicleClass}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300}>
              Start Time:
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300} align="right">
              {format(startTime, "dd-MMM hh:mm a")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={300}>
              End Time:
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" fontWeight={100} align="right">
              {format(endTime, "dd-MMM hh:mm a")}
            </Typography>
          </Grid>
        </Grid>

        {/* Start Shift Button */}
        <Box
          sx={{
            marginTop: 2,
            backgroundColor: "#00263A",
            textAlign: "center",
            padding: 1,
            borderRadius: 1,
            mt: 2,
          }}
        >
          <Button
            onClick={() => onStartShift(vehicle)}
            disabled={isStarting}
            sx={{
              width: "100%",
              backgroundColor: "#00263A",
              color: "white",
              padding: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#003955",
              },
            }}
          >
            {isStarting ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "START SHIFT"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
