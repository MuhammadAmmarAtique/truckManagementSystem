import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { ICustomFieldGroup } from "@/entities/types/customFieldGroupTypes";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { useState } from "react";

interface Props {
  group: ICustomFieldGroup | undefined;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CustomFieldGroupDetails({
  group,
  onEdit,
  onDelete,
}: Props) {
  if (!group) {
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
          Please create Custom Field Group to show details.
        </Typography>
      </Box>
    );
  }

  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ px: 2, height: "100vh", overflow: "auto", mt: -5 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{
          borderBottom: "1px solid #E0E0E0",
          pb: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <AvatarText text={group.name} />
          <Typography variant="h6">{group.name}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onDelete}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onEdit}
            startIcon={<CreateIcon />}
          >
            Edit
          </Button>
        </Stack>
      </Stack>

      {/* DETAILS tab underline */}
      <Box sx={{ mb: 2, mt: -3 }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="DETAILS" />
        </Tabs>
      </Box>

      {/* Row: Custom Field Group Name */}
      <Stack direction="row" spacing={4} mb={2}>
        <Typography variant="subtitle2" sx={{ minWidth: 250 }}>
          Custom Field Group Name
        </Typography>
        <Typography variant="body2">{group.name}</Typography>
      </Stack>

      {/* Row: Custom Field Configurations */}
      <Stack direction="row" spacing={4} alignItems="flex-start">
        <Typography variant="subtitle2" sx={{ minWidth: 250 }}>
          Custom Field Configurations
        </Typography>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 0 }}>
            {(group.customFields?.length ?? 0) === 0 ? (
              <Typography
                color="textSecondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No custom fields configured in this group
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#E1EAF2" }}>
                      <TableCell>Custom Field Name</TableCell>
                      <TableCell>System Visibility</TableCell>
                      <TableCell>Driver Visibility</TableCell>
                      <TableCell>Required Stage</TableCell>
                      <TableCell>Replicate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.customFields.map((config, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Chip
                            label={config.customFieldName}
                            size="small"
                            variant="outlined"
                            sx={{ color: "#28628E" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={config.systemVisibility}
                            size="small"
                            variant="outlined"
                            sx={{ color: "#28628E" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={config.driverVisibility}
                            size="small"
                            variant="outlined"
                            sx={{ color: "#28628E" }}
                          />
                        </TableCell>
                        <TableCell>
                          {config.requiredStage ? (
                            <Chip
                              label={config.requiredStage}
                              size="small"
                              variant="outlined"
                              sx={{ color: "#28628E" }}
                            />
                          ) : (
                            <Typography color="textSecondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={config.replicate ? "Yes" : "No"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

function AvatarText({ text }: { text: string }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#003B5C",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 18,
      }}
    >
      {text.charAt(0).toUpperCase()}
    </Box>
  );
}
