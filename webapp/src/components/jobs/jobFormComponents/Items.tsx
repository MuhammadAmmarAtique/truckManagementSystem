import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import SelectField from "./SelectField";
import { ITEM_OPTIONS } from "@/utils/jobConstants";
import { useFormDisable } from "@/contexts/FormDisableContext";

interface ItemData {
  name: string;
  qty: number;
  unit: string;
}

const ITEM_UNITS: Record<string, string> = {
  Asphalt: "tonne",
  "Blue Metal 10mm": "tonne",
  "Blue Metal 20mm": "tonne",
  "Brick Laying Sand": "tonne",
  "Premium Garden Mix": "cubic meter",
};

const Items: React.FC = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const itemsList: ItemData[] = watch("itemsList") || [];

  // watch form values
  const selectedItem = useWatch({ control, name: "selectedItem" });
  const orderQty = useWatch({ control, name: "orderQty" });
  const primaryUnit = useWatch({ control, name: "primaryUnit" });

  // keep primaryUnit updated whenever selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setValue("primaryUnit", ITEM_UNITS[selectedItem] || "tonne", {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      // clear primary unit if item is cleared
      setValue("primaryUnit", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedItem, setValue]);

  const handleAddItem = () => {
    if (!selectedItem || !orderQty || !primaryUnit) return;

    const newItem: ItemData = {
      name: selectedItem,
      qty: Number(orderQty),
      unit: primaryUnit,
    };

    setValue("itemsList", [...itemsList, newItem], { shouldValidate: true });

    // reset fields after successful add
    setValue("selectedItem", "", { shouldValidate: false });
    setValue("orderQty", "", { shouldValidate: false });
    setValue("primaryUnit", "", { shouldValidate: false });
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = itemsList.filter((_, i) => i !== index);
    setValue("itemsList", updatedList, { shouldValidate: true });
  };

  const disableAllExceptReference = useFormDisable();
  const getDisabled = (field: string) =>
    disableAllExceptReference && field !== "jobReference";
  return (
    <Box sx={{ border: "1px solid #ddd", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
        Items
      </Typography>

      <Grid container spacing={2} alignItems="flex-start">
        {/* Select Item */}
        <Grid size={{ xs: 12, md: 3 }}>
          <SelectField
            name="selectedItem"
            label="Select Item:"
            required
            options={ITEM_OPTIONS}
            sx={{ "& .MuiInputBase-root": { height: 40 } }}
            placeHolder="Items"
            disabled={getDisabled("selectedItem")}
          />
        </Grid>

        {/* Order Qty */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Order Qty: <span style={{ color: "red" }}>*</span>
          </Typography>
          <Controller
            name="orderQty"
            control={control}
            render={({ field }) => (
              <TextField
                type="text"
                placeholder="No. of items"
                InputProps={{
                  sx: {
                    "& input::placeholder": {
                      fontSize: "0.85rem",
                      color: "#888",
                      opacity: 1,
                    },
                  },
                }}
                fullWidth
                size="small"
                {...field}
                error={!!errors.orderQty}
                helperText={
                  errors.orderQty ? String(errors.orderQty.message) : ""
                }
                onKeyDown={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                  if (e.key === "0" && value.length === 0) {
                    e.preventDefault();
                  }
                }}
                disabled={getDisabled("orderQty")}
              />
            )}
          />
        </Grid>

        {/* Primary Unit */}
        <Grid size={{ xs: 6, md: 2 }}>
          <Typography variant="body2">Primary Unit:</Typography>
          <Typography variant="body1" sx={{ mt: 1, color: "rgba(0,0,0,0.7)" }}>
            {primaryUnit || ""}
          </Typography>
        </Grid>

        {/* Add Button */}
        <Grid
          size={{ xs: 6, md: 5 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            onClick={handleAddItem}
            disabled={getDisabled("addItem")}
            startIcon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#4492C6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <AddIcon fontSize="small" />
              </Box>
            }
            sx={{
              textTransform: "uppercase",
              color: "#4492c6",
              fontWeight: 500,
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      {/* Display Added Items */}
      {itemsList.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Added Items:
          </Typography>
          {itemsList.map((item: ItemData, index: number) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 2,
                py: 0.5,
              }}
            >
              <Typography sx={{ width: "20%" }}>{item.name}</Typography>
              <Typography sx={{ width: "20%" }}>{item.qty}</Typography>
              <Typography sx={{ width: "20%" }}>{item.unit}</Typography>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteItem(index)}
                disabled={getDisabled("deleteItem")}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Items list validation error */}
      {errors.itemsList && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {String(errors.itemsList.message)}
        </Typography>
      )}
    </Box>
  );
};

export default Items;
