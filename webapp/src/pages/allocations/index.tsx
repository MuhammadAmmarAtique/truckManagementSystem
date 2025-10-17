import Head from "next/head";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PauseIcon from "@mui/icons-material/Pause";
import RefreshIcon from "@mui/icons-material/Refresh";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Layout from "@/components/appbar/Layout";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import VehicleCard from "@/components/vehicles/VehicleCard";
import JobCard from "@/components/jobs/JobCard";
import {
  GET_ALLOCATION_DATA,
  ASSIGN_JOB_TO_VEHICLE,
  UNASSIGN_JOB_FROM_VEHICLE,
} from "@/graphql/query/allocations.query";
import {
  JOB_ASSIGNED_SUBSCRIPTION,
  JOB_UNASSIGNED_SUBSCRIPTION,
} from "@/graphql/subscription/allocations.subscription";
// Import vehicle subscriptions
import {
  VEHICLE_CREATED_SUBSCRIPTION,
  VEHICLE_UPDATED_SUBSCRIPTION,
  VEHICLE_DELETED_SUBSCRIPTION,
} from "@/graphql/subscription/vehicle.subscription";
// Import job subscriptions
import {
  JOB_CREATED,
  JOB_UPDATED,
  JOB_DELETED,
} from "@/graphql/subscription/job.subscription";
import { vehicleColors } from "@/utils/allocationsUtils";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

// ----------------- Types -----------------
interface Job {
  id: string;
  jobReference: string;
  pickupFrom: string;
  deliverTo: string;
}

interface Vehicle {
  id: string;
  identifier: string;
  licencePlate: string;
  make: string;
  assignedJobs: Job[];
}

interface AllocationData {
  getAllVehicles: Vehicle[];
  jobs: Job[];
}

interface JobAssignmentPayload {
  vehicle: Vehicle;
  job: Job;
}

interface JobAssignedSubData {
  assignJobToVehicle: JobAssignmentPayload;
}

interface JobUnassignedSubData {
  unassignJobFromVehicle: JobAssignmentPayload;
}

// Vehicle subscription types
interface VehicleCreatedData {
  vehicleCreated: Vehicle;
}

interface VehicleUpdatedData {
  vehicleUpdated: Vehicle;
}

interface VehicleDeletedData {
  vehicleDeleted: string;
}

// Job subscription types
interface JobCreatedData {
  jobCreated: Job;
}

interface JobUpdatedData {
  jobUpdated: Job;
}

interface JobDeletedData {
  jobDeleted: string;
}

function Allocations() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const { loading, error, data, client } =
    useQuery<AllocationData>(GET_ALLOCATION_DATA);

  const [assignJob] = useMutation(ASSIGN_JOB_TO_VEHICLE);
  const [unassignJob] = useMutation(UNASSIGN_JOB_FROM_VEHICLE);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedShift, setSelectedShift] = useState("");
  const [open, setOpen] = useState(false);

  // Create theme-aware scrollbar styles
  const thinScrollbarStyles = {
    // WebKit browsers (Chrome, Safari, Edge)
    '&::-webkit-scrollbar': {
      width: '4px',
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
      borderRadius: '2px',
      '&:hover': {
        background: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      },
    },
    '&::-webkit-scrollbar-corner': {
      background: 'transparent',
    },
    // Firefox
    scrollbarWidth: 'thin',
    scrollbarColor: isDarkMode 
      ? 'rgba(255,255,255,0.3) rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.3) rgba(0,0,0,0.1)',
  };

  // --- Job Assignment Subscriptions ---
  useSubscription<JobAssignedSubData>(JOB_ASSIGNED_SUBSCRIPTION, {
    onData: ({ data, client }) => {
      const payload = data?.data?.assignJobToVehicle;
      if (!payload) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return existing;
          return {
            ...existing,
            getAllVehicles: existing.getAllVehicles.map((v) =>
              v.id === payload.vehicle.id ? payload.vehicle : v
            ),
            jobs: existing.jobs,
          };
        }
      );
    },
  });

  useSubscription<JobUnassignedSubData>(JOB_UNASSIGNED_SUBSCRIPTION, {
    onData: ({ data, client }) => {
      const payload = data?.data?.unassignJobFromVehicle;
      if (!payload) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return existing;
          return {
            ...existing,
            getAllVehicles: existing.getAllVehicles.map((v) =>
              v.id === payload.vehicle.id ? payload.vehicle : v
            ),
            jobs: existing.jobs,
          };
        }
      );
    },
  });

  // --- Vehicle Subscriptions ---
  useSubscription<VehicleCreatedData>(VEHICLE_CREATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      console.log("Vehicle Created Subscription fired in Allocations", data);
      const newVehicle = data?.data?.vehicleCreated;
      if (!newVehicle) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return { getAllVehicles: [newVehicle], jobs: [] };
          
          // Check if vehicle already exists
          if (existing.getAllVehicles.find((v) => v.id === newVehicle.id)) {
            return existing;
          }
          
          return {
            ...existing,
            getAllVehicles: [...existing.getAllVehicles, newVehicle],
          };
        }
      );
    },
  });

  useSubscription<VehicleUpdatedData>(VEHICLE_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      console.log("Vehicle Updated Subscription fired in Allocations", data);
      const updatedVehicle = data?.data?.vehicleUpdated;
      if (!updatedVehicle) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return existing;
          
          return {
            ...existing,
            getAllVehicles: existing.getAllVehicles.map((v) =>
              v.id === updatedVehicle.id ? { ...v, ...updatedVehicle } : v
            ),
          };
        }
      );
    },
  });

  useSubscription<VehicleDeletedData>(VEHICLE_DELETED_SUBSCRIPTION, {
    onData: ({ data }) => {
      console.log("Vehicle Deleted Subscription fired in Allocations", data);
      const deletedVehicleId = data?.data?.vehicleDeleted;
      if (!deletedVehicleId) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return existing;
          
          return {
            ...existing,
            getAllVehicles: existing.getAllVehicles.filter(
              (v) => v.id !== deletedVehicleId
            ),
          };
        }
      );
    },
  });

  // --- Job Subscriptions ---
  useSubscription<JobCreatedData>(JOB_CREATED, {
    onData: ({ data }) => {
      console.log("Job Created Subscription fired in Allocations", data);
      const newJob = data?.data?.jobCreated;
      if (!newJob) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return { getAllVehicles: [], jobs: [newJob] };
          
          // Check if job already exists
          if (existing.jobs.find((j) => j.id === newJob.id)) {
            return existing;
          }
          
          return {
            ...existing,
            jobs: [...existing.jobs, newJob],
          };
        }
      );
    },
  });

  useSubscription<JobUpdatedData>(JOB_UPDATED, {
    onData: ({ data }) => {
      console.log("Job Updated Subscription fired in Allocations", data);
      const updatedJob = data?.data?.jobUpdated;
      if (!updatedJob) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return existing;
          
          return {
            ...existing,
            jobs: existing.jobs.map((j) =>
              j.id === updatedJob.id ? { ...j, ...updatedJob } : j
            ),
          };
        }
      );
    },
  });

  useSubscription<JobDeletedData>(JOB_DELETED, {
    onData: ({ data }) => {
      console.log("Job Deleted Subscription fired in Allocations", data);
      const deletedJobId = data?.data?.jobDeleted;
      if (!deletedJobId) return;

      client.cache.updateQuery<AllocationData>(
        { query: GET_ALLOCATION_DATA },
        (existing) => {
          if (!existing) return existing;
          
          return {
            ...existing,
            jobs: existing.jobs.filter((j) => j.id !== deletedJobId),
            // Also remove the job from any vehicle's assignedJobs
            getAllVehicles: existing.getAllVehicles.map((v) => ({
              ...v,
              assignedJobs: v.assignedJobs.filter((j) => j.id !== deletedJobId),
            })),
          };
        }
      );
    },
  });

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", pt: 30 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Typography color="error">Error: {error.message}</Typography>
        </Box>
      </Layout>
    );
  }

  const allVehicles = data?.getAllVehicles || [];
  const allJobs = data?.jobs || [];

  const assignedJobIds = new Set(
    allVehicles.flatMap((v) => v.assignedJobs.map((j) => j.id))
  );
  const unassignedJobs = allJobs.filter((j) => !assignedJobIds.has(j.id));

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;
    const jobId = draggableId;

    if (sourceId === "unassigned-jobs" && destinationId !== "unassigned-jobs") {
      assignJob({ variables: { vehicleId: destinationId, jobId } });
    } else if (
      sourceId !== "unassigned-jobs" &&
      destinationId === "unassigned-jobs"
    ) {
      unassignJob({ variables: { vehicleId: sourceId, jobId } });
    } else if (
      sourceId !== "unassigned-jobs" &&
      destinationId !== "unassigned-jobs" &&
      sourceId !== destinationId
    ) {
      unassignJob({ variables: { vehicleId: sourceId, jobId } });
      assignJob({ variables: { vehicleId: destinationId, jobId } });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Allocations</title>
        <meta
          name="description"
          content="This page allows users to allocate jobs to vehicles"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ 
        p: 2, 
        height: "100vh", 
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
      }}>
        {/* Header Section with Filters and Icons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pl: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={selectedDate}
                format="MM/DD/YYYY"
                minDate={dayjs()}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    onClick: () => setOpen(true),  
                    InputProps: {
                      readOnly: true,
                      sx: { cursor: "pointer" },
                    },
                    sx: {
                      width: "250px",
                      label: "Date",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        "& fieldset": { borderColor: theme.palette.text.secondary },
                        "&:hover fieldset": { borderColor: theme.palette.text.primary },
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                      },
                      "& .MuiInputLabel-root": {
                        color: theme.palette.text.secondary,
                      },
                    },
                  },
                  actionBar: { actions: ["clear", "today"] },
                }}
              />
            </LocalizationProvider>
            <FormControl variant="outlined" size="small" sx={{ width: "250px" }}>
              <Select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: theme.palette.background.secondary,
                  color: theme.palette.text.primary,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.secondary,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  "& .MuiSelect-icon": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <MenuItem value="">
                  <Typography color="text.secondary">Select</Typography>
                </MenuItem>
                <MenuItem value="Shift A">Shift A</MenuItem>
                <MenuItem value="Shift B">Shift B</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 2 }}>
            {[SearchIcon, FilterListIcon, PauseIcon, RefreshIcon].map((Icon, index) => (
              <IconButton
                key={index}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": { 
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: "flex", gap: 2, height: "calc(100vh - 100px)" }}>
            {/* Main scrollable container for vehicles and assigned jobs */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                pr: 1,
                mt: 1.5,
                ...thinScrollbarStyles,
              }}
            >
              {/* Column 1: Vehicles */}
              <Box
                sx={{
                  width: "180px",
                  minWidth: "180px",
                  flexShrink: 0,
                }}
              >
                {allVehicles.map((vehicle, index) => (
                  <Box key={vehicle.id} sx={{ display: "block", mt: 0.3, mb: 2.7 }}>
                    <VehicleCard
                      vehicle={vehicle}
                      borderColor={vehicleColors[index % vehicleColors.length]}
                    />
                  </Box>
                ))}
              </Box>

              {/* Column 2: Assigned Jobs with horizontal scroll */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  minWidth: 0,
                }}
              >
                {allVehicles.map((vehicle) => (
                  <Box
                    key={`assigned-${vehicle.id}`}
                    sx={{
                      height: "138px",
                      minHeight: "138px",
                      display: "flex",
                      minWidth: 0,
                    }}
                  >
                    <Droppable droppableId={vehicle.id} direction="horizontal">
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            display: "flex",
                            gap: 1,
                            width: "100%",
                            height: "143px",
                            minHeight: "143px",
                            backgroundColor: snapshot.isDraggingOver
                              ? theme.palette.action.hover
                              : "transparent",
                            borderRadius: 1,
                            border: snapshot.isDraggingOver
                              ? `2px dashed ${theme.palette.primary.main}`
                              : `2px dashed transparent`,
                            alignItems: "flex-start",
                            overflowX: "auto",
                            overflowY: "hidden",
                            minWidth: 0,
                            ...thinScrollbarStyles,
                          }}
                        >
                          {vehicle.assignedJobs.length > 0 ? (
                            vehicle.assignedJobs.map((job, jobIndex) => (
                              <Draggable
                                key={job.id}
                                draggableId={job.id}
                                index={jobIndex}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      minWidth: "160px",
                                      width: "160px",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <JobCard
                                      job={job}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </Box>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <Box
                              sx={{
                                p: 2,
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minWidth: "200px",
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                Drag and drop jobs here
                              </Typography>
                            </Box>
                          )}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Column 3: Unassigned Jobs */}
            <Box
              sx={{
                width: "360px",
                minWidth: "360px",
                overflowY: "auto",
    
                borderRadius: 1,
                p: 1,
                ...thinScrollbarStyles,
              }}
            >
              <Droppable droppableId="unassigned-jobs">
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      minHeight: "100%",
                      backgroundColor: snapshot.isDraggingOver
                        ? theme.palette.action.hover
                        : "transparent",
                      borderRadius: 1,
                      alignContent: "flex-start",
                    }}
                  >
                    {unassignedJobs.map((job, index) => (
                      <Draggable
                        key={job.id}
                        draggableId={job.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              width: "calc(50% - 4px)",
                              minWidth: "160px",
                            }}
                          >
                            <JobCard
                              job={job}
                              isDragging={snapshot.isDragging}
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Box>
        </DragDropContext>
      </Box>
    </Layout>
  );
}

export default Allocations;

export const getServerSideProps = withPageAuthRequired();