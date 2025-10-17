import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import type IJobFormState from "@/entities/types/jobTypes";
import SelectField from "./SelectField";
import { contacts } from "@/utils/jobConstants";
import {
  getLocationsForContact,
  useAutoSelectLocation,
} from "@/hooks/useAutoSelectLocation";
import { useFormDisable } from "@/contexts/FormDisableContext";

interface JobRouteProps {
  isEdit?: boolean;
}

const JobRoute: React.FC<JobRouteProps> = ({ isEdit = false }) => {
  const { control } = useFormContext<IJobFormState>();

  const pickupFrom = useWatch({ name: "pickupFrom", control });
  const deliverTo = useWatch({ name: "deliverTo", control });

  useAutoSelectLocation("pickupFrom", "pickupLocation", isEdit);
  useAutoSelectLocation("deliverTo", "deliverLocation", isEdit);

  const disableAllExceptReference = useFormDisable();
  const getDisabled = (field: string) =>
    disableAllExceptReference && field !== "jobReference";

  return (
    <Box sx={{ border: "1px solid #ddd", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Job Route
      </Typography>

      <Grid container spacing={2}>
        {/*  Billable  */}
        <Grid size={{ xs: 12 }}>
          <SelectField
            name="billable"
            label="Billable:"
            options={contacts}
            required
            sx={{ width: { xs: "100%", sm: "49%" } }}
            placeHolder="Billable Company"
            disabled={getDisabled("billable")}
          />
        </Grid>

        {/*  Pickup From  */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="pickupFrom"
            label="Pickup From:"
            required
            options={contacts}
            placeHolder="Origin Company"
            disabled={getDisabled("pickupFrom")}
          />
        </Grid>

        {/*  Pickup Location  */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="pickupLocation"
            label="Pickup Location:"
            required
            disabled={getDisabled("pickupLocation") || !pickupFrom}
            returnObject
            options={pickupFrom ? getLocationsForContact(pickupFrom) : []}
          />
        </Grid>

        {/* Deliver To  */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="deliverTo"
            label="Deliver To:"
            required
            options={contacts}
            placeHolder="Destination Company"
            disabled={getDisabled("deliverTo")}
          />
        </Grid>

        {/*  Deliver Location  */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="deliverLocation"
            label="Deliver Location:"
            required
            disabled={getDisabled("deliverLocation") || !deliverTo}
            returnObject
            options={deliverTo ? getLocationsForContact(deliverTo) : []}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobRoute;
