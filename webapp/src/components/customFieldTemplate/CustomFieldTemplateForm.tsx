import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Divider,
  FormControl,
  Grid,
  Select,
  Switch,
  FormHelperText,
  Tabs,
  Tab,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ICustomFieldTemplate,
  FIELD_TYPES,
} from "@/entities/types/customFieldTemplateTypes";
import { customFieldTemplateValidationSchema } from "@/entities/validation/customFieldTemplateSchema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (field: ICustomFieldTemplate) => void;
  initialData?: ICustomFieldTemplate;
}

export default function CustomFieldTemplateForm({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICustomFieldTemplate>({
    resolver: yupResolver(customFieldTemplateValidationSchema),
    defaultValues: {
      id: initialData?.id ?? crypto.randomUUID(),
      name: "",
      type: "",
      systemVisibility: "",
      driverVisibility: "",
      requiredStage: null,
      replicate: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        id: crypto.randomUUID(),
        name: "",
        type: "",
        systemVisibility: "",
        driverVisibility: "",
        requiredStage: null,
        replicate: false,
      });
    }
  }, [initialData, open, reset]);

  const [tab, setTab] = useState(0);

  const onSubmit = (data: ICustomFieldTemplate) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle sx={{ pb: 0 }}>
        {initialData
          ? "Edit Custom Field Template"
          : "Add Custom Field Template"}
        <Divider sx={{ mt: 1 }} />
      </DialogTitle>

      {/* DETAILS tab underline */}
      <Box sx={{ px: 3 }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="DETAILS" />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid size={{ xs: 3 }}>
              <Typography sx={{ textAlign: "right", pr: 1, pt: 2 }}>
                Name<span style={{ color: "red" }}> *</span>
              </Typography>
            </Grid>
            <Grid size={{ xs: 9 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Type */}
            <Grid size={{ xs: 3 }}>
              <Typography sx={{ textAlign: "right", pr: 1, pt: 2 }}>
                Type<span style={{ color: "red" }}> *</span>
              </Typography>
            </Grid>
            <Grid size={{ xs: 9 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.type}>
                    <Select {...field}>
                      {FIELD_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.type?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {/* System Visibility */}
            <Grid size={{ xs: 3 }}>
              <Typography sx={{ textAlign: "right", pr: 1, pt: 2 }}>
                System Visibility<span style={{ color: "red" }}> *</span>
              </Typography>
            </Grid>
            <Grid size={{ xs: 9 }}>
              <Controller
                name="systemVisibility"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.systemVisibility}
                  >
                    <Select {...field}>
                      {["Editable", "View only", "Hidden"].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.systemVisibility?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Driver Visibility */}
            <Grid size={{ xs: 3 }}>
              <Typography sx={{ textAlign: "right", pr: 1, pt: 2 }}>
                Driver Visibility<span style={{ color: "red" }}> *</span>
              </Typography>
            </Grid>
            <Grid size={{ xs: 9 }}>
              <Controller
                name="driverVisibility"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.driverVisibility}
                  >
                    <Select {...field}>
                      {["Editable", "View only", "Hidden"].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.driverVisibility?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Required Stage */}
            <Grid size={{ xs: 3 }}>
              <Typography sx={{ textAlign: "right", pr: 1, pt: 2 }}>
                Required Stage
              </Typography>
            </Grid>
            <Grid size={{ xs: 9 }}>
              <Controller
                name="requiredStage"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <Select {...field}>
                      {["Select", "Allocation", "Loading", "Unloading"].map(
                        (stage) => (
                          <MenuItem key={stage} value={stage}>
                            {stage}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Replicate */}
            <Grid size={{ xs: 3 }}>
              <Typography sx={{ textAlign: "right", pr: 1, pt: 2 }}>
                Replicate
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 9 }}
              sx={{ display: "flex", alignItems: "center", pl: 1 }}
            >
              <Controller
                name="replicate"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: "divider" }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#4492c6" }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
