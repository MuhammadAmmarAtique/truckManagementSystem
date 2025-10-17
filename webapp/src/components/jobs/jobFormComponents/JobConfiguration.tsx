import React, { useMemo, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type IJobFormState from "@/entities/types/jobTypes";
import SelectField from "./SelectField";
import { ICustomFieldGroup } from "@/entities/types/customFieldGroupTypes";
import { useFormDisable } from "@/contexts/FormDisableContext";

const JobConfiguration: React.FC = () => {
  const { control, watch, setValue } = useFormContext<IJobFormState>();
  const [customFieldGroups, setCustomFieldGroups] = useState<
    ICustomFieldGroup[]
  >([]);
  const [isCustomFieldGroupDisabled, setIsCustomFieldGroupDisabled] =
    useState(false);
  const [autoSelectedGroup, setAutoSelectedGroup] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("customFieldGroups");
      if (stored) setCustomFieldGroups(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to load customFieldGroups:", err);
    }
  }, []);

  const customFieldGroupOptions = customFieldGroups.map((group) => ({
    value: group.id ?? group.name,
    label: group.name,
  }));

  const selectedGroupId = watch("customFieldGroup");
  const deliveryType = watch("deliveryType");

  // Auto-select based on deliveryType
  useEffect(() => {
    if (!customFieldGroups.length) {
      setIsCustomFieldGroupDisabled(false);
      return;
    }

    if (!deliveryType) {
      // Reset everything if deliveryType cleared
      if (autoSelectedGroup) {
        setValue("customFieldGroup", "");
      }
      setIsCustomFieldGroupDisabled(false);
      setAutoSelectedGroup(false);
      return;
    }

    let index = -1;
    if (deliveryType === "deliveryType1") index = 0;
    else if (deliveryType === "deliveryType2") index = 1;
    else if (deliveryType === "deliveryType3") index = 2;

    if (index >= 0 && customFieldGroups[index]) {
      const currentValue = watch("customFieldGroup");
      if (!currentValue || autoSelectedGroup) {
        setValue(
          "customFieldGroup",
          customFieldGroups[index].id ?? customFieldGroups[index].name
        );
        setIsCustomFieldGroupDisabled(true);
        setAutoSelectedGroup(true);
      }
    } else {
      setIsCustomFieldGroupDisabled(false);
      setAutoSelectedGroup(false);
    }
  }, [deliveryType, customFieldGroups, setValue, watch, autoSelectedGroup]);

  // Detect manual change of customFieldGroup
  useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name === "customFieldGroup" && value.customFieldGroup) {
        setAutoSelectedGroup(false); // user manually changed it
        setIsCustomFieldGroupDisabled(false);
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const selectedGroup = useMemo(
    () =>
      customFieldGroups.find(
        (g) => g.id === selectedGroupId || g.name === selectedGroupId
      ),
    [customFieldGroups, selectedGroupId]
  );

  const disableAllExceptReference = useFormDisable();
  const getDisabled = (field: string) =>
    disableAllExceptReference && field !== "jobReference";

  return (
    <Box sx={{ border: "1px solid #ddd", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Job Configuration
      </Typography>

      <Grid container spacing={2}>
        {/* Job Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">Job Type:</Typography>
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                color="primary"
                value={field.value}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) field.onChange(newValue);
                }}
                disabled={getDisabled("jobType")}
              >
                <ToggleButton value="Pickup and Delivery">
                  Pickup & Delivery
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>

        {/* Fleet */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="fleet"
            label="Fleet:"
            options={[{ value: "southernFleet", label: "Southern Fleet" }]}
            disabled={getDisabled("fleet")}
          />
        </Grid>

        {/* Payment Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">Payment Type:</Typography>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                color="primary"
                exclusive
                value={field.value}
                onChange={(_, val) => val && field.onChange(val)}
                disabled={getDisabled("paymentType")}
              >
                <ToggleButton value="cod">COD</ToggleButton>
                <ToggleButton value="prepaid">Prepaid</ToggleButton>
                <ToggleButton value="account">Account</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>

        {/* Shift */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="shift"
            label="Shift:"
            options={[{ value: "defaultShift", label: "Default Shift" }]}
            disabled={getDisabled("shift")}
          />
        </Grid>

        {/* Delivery Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="deliveryType"
            label="Delivery Type:"
            options={[
              { value: "deliveryType1", label: "Delivery Type 1" },
              { value: "deliveryType2", label: "Delivery Type 2" },
              { value: "deliveryType3", label: "Delivery Type 3" },
            ]}
            placeHolder="Workflow Category Name"
            disabled={getDisabled("deliveryType")}
          />
        </Grid>

        {/* Custom Field Group */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name="customFieldGroup"
            label="Custom Field Group:"
            options={customFieldGroupOptions}
            disabled={
              getDisabled("customFieldGroup") || isCustomFieldGroupDisabled
            }
            placeHolder="Custom Field Group Name"
          />
        </Grid>

        {/* Dynamic Fields */}
        {selectedGroup?.customFields
          ?.filter((cf) => cf.systemVisibility !== "Hidden")
          .map((cf) => (
            <Grid key={cf.customFieldId} size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {cf.customFieldName}:
              </Typography>
              <Controller
                name={`customFieldValues.${cf.customFieldId}`}
                control={control}
                render={({ field }) => {
                  const isEditable = cf.systemVisibility === "Editable";
                  if (cf.customFieldName.toLowerCase() === "boolean") {
                    return (
                      <Switch
                        {...field}
                        checked={!!field.value}
                        onChange={(e) =>
                          isEditable && field.onChange(e.target.checked)
                        }
                        disabled={!isEditable}
                      />
                    );
                  }
                  return (
                    <TextField
                      {...field}
                      size="small"
                      type={
                        cf.customFieldName.toLowerCase() === "number"
                          ? "number"
                          : "text"
                      }
                      fullWidth
                      disabled={!isEditable}
                    />
                  );
                }}
              />
            </Grid>
          ))}

        {/* Rollover */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">Rollover:</Typography>
          <Controller
            name="rollover"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={getDisabled("rollover")}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobConfiguration;
