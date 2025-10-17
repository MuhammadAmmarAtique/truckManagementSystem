import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Switch,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ICustomFieldGroup } from "@/entities/types/customFieldGroupTypes";
import { ICustomFieldTemplate } from "@/entities/types/customFieldTemplateTypes";
import { customFieldGroupSchema } from "@/entities/validation/customFieldGroupSchema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (group: ICustomFieldGroup) => void;
  initialData?: ICustomFieldGroup;
}

export default function CustomFieldGroupForm({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const [availableFields, setAvailableFields] = useState<
    ICustomFieldTemplate[]
  >([]);
  const [tab, setTab] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ICustomFieldGroup>({
    resolver: yupResolver(customFieldGroupSchema),
    defaultValues: {
      name: "",
      customFields: [
        {
          customFieldId: "",
          customFieldName: "",
          systemVisibility: "",
          driverVisibility: "",
          requiredStage: null,
          replicate: false,
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "customFields",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("customFields");
      const stored = data ? JSON.parse(data) : [];
      setAvailableFields(stored);
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        customFields: [
          {
            customFieldId: "",
            customFieldName: "",
            systemVisibility: "",
            driverVisibility: "",
            requiredStage: null,
            replicate: false,
          },
        ],
      });
    }
  }, [initialData, open, reset]);

  const handleFieldSelect = (index: number, fieldId: string) => {
    const selectedField = availableFields.find((f) => f.id === fieldId);
    if (selectedField) {
      update(index, {
        customFieldId: fieldId,
        customFieldName: selectedField.name,
        systemVisibility: selectedField.systemVisibility,
        driverVisibility: selectedField.driverVisibility,
        requiredStage: selectedField.requiredStage || null,
        replicate: selectedField.replicate || false,
      });
    }
  };

  const onSubmit = (data: ICustomFieldGroup) => {
    onSave({
      id: initialData?.id || Date.now().toString(),
      ...data,
    });
    onClose();
  };

  const handleClose = () => {
    reset({
      name: "",
      customFields: [
        {
          customFieldId: "",
          customFieldName: "",
          systemVisibility: "",
          driverVisibility: "",
          requiredStage: null,
          replicate: false,
        },
      ],
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "80vw",
          maxHeight: "86vh",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {initialData ? "Edit Custom Field Group" : "Add Custom Field Group"}
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{}}>
        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, mt: -2 }}>
          <Tab label="DETAILS" />
          {/* Future: Add more tabs here if needed */}
        </Tabs>

        {/* Tab Content */}
        {tab === 0 && (
          <>
            {/* Group Name */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Typography>
                Custom Field Group Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    size="small"
                    fullWidth
                    required
                    {...field}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ "& .MuiFormHelperText-root": { ml: 0, pl: 0 } }}
                  />
                )}
              />
            </Box>

            {/* Custom Field Configurations */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Custom Field Configurations
            </Typography>

            {errors.customFields?.message && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.customFields.message as string}
              </Typography>
            )}

            {/* Header Row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 2fr 2fr 2fr auto",
                gap: 2,
                px: 2,
                py: 1,
                mb: 1,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                alignItems: "center",
              }}
            >
              <Typography fontWeight={600} fontSize="0.875rem">
                Custom Field Name
              </Typography>
              <Typography fontWeight={600} fontSize="0.875rem">
                System Visibility
              </Typography>
              <Typography fontWeight={600} fontSize="0.875rem">
                Driver Visibility
              </Typography>
              <Typography fontWeight={600} fontSize="0.875rem">
                Required Stage
              </Typography>
              <Typography fontWeight={600} fontSize="0.875rem">
                Replicate
              </Typography>
              <Box />
            </Box>

            {/* Dynamic Rows */}
            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 2fr 2fr 1fr auto",
                  gap: 3,
                  px: 1,
                  py: 1,
                  mb: 1,
                  alignItems: "center",
                }}
              >
                {/* Custom Field Name */}
                <Controller
                  name={`customFields.${index}.customFieldId`}
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.customFields?.[index]?.customFieldId}
                    >
                      <Select
                        {...field}
                        displayEmpty
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleFieldSelect(index, e.target.value);
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Custom Field</em>
                        </MenuItem>
                        {availableFields.map((f) => (
                          <MenuItem
                            key={f.id ?? ""}
                            value={f.id ?? ""}
                            disabled={watch("customFields").some(
                              (cf, i) =>
                                i !== index && cf.customFieldId === f.id
                            )}
                          >
                            {f.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                {/* System Visibility */}
                <Controller
                  name={`customFields.${index}.systemVisibility`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <Select
                        {...field}
                        disabled={!watch(`customFields.${index}.customFieldId`)}
                      >
                        <MenuItem value="Editable">Editable</MenuItem>
                        <MenuItem value="View only">View Only</MenuItem>
                        <MenuItem value="Hidden">Hidden</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                {/* Driver Visibility */}
                <Controller
                  name={`customFields.${index}.driverVisibility`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <Select
                        {...field}
                        disabled={!watch(`customFields.${index}.customFieldId`)}
                      >
                        <MenuItem value="Editable">Editable</MenuItem>
                        <MenuItem value="View only">View Only</MenuItem>
                        <MenuItem value="Hidden">Hidden</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                {/* Required Stage */}
                <Controller
                  name={`customFields.${index}.requiredStage`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <Select
                        {...field}
                        disabled={!watch(`customFields.${index}.customFieldId`)}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value="Planning">Allocation</MenuItem>
                        <MenuItem value="In Transit">Loading</MenuItem>
                        <MenuItem value="Delivered">Unloading</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                {/* Replicate */}
                <Controller
                  name={`customFields.${index}.replicate`}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={!!field.value}
                      disabled={!watch(`customFields.${index}.customFieldId`)}
                    />
                  )}
                />

                {/* Action Button */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {index === 0 ? (
                    <Button
                      startIcon={<Add />}
                      onClick={() =>
                        append({
                          customFieldId: "",
                          customFieldName: "",
                          systemVisibility: "",
                          driverVisibility: "",
                          requiredStage: null,
                          replicate: false,
                        })
                      }
                      size="small"
                      sx={{ color: "#4492C6", fontWeight: 500, px: 2 }}
                    >
                      ADD
                    </Button>
                  ) : (
                    <IconButton
                      onClick={() => remove(index)}
                      color="error"
                      size="small"
                    >
                      <Close />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: "divider" }}
      >
        <Button onClick={handleClose} variant="outlined">
          CANCEL
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          sx={{ backgroundColor: "#4492C6" }}
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
