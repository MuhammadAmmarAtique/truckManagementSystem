// frontend/src/pages/vehicles/index.tsx
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Head from "next/head";
import VehicleFilters from "@/components/vehicles/VehicleFilters";
import VehicleList from "@/components/vehicles/VehicleList";
import VehicleDetails from "@/components/vehicles/VehicleDetails";
import { getVehicleColor } from "@/utils/vehicleContants";
import AddVehicleForm from "@/components/vehicles/AddVehicleForm";
import {
  MainContainer,
  GridContainer,
  FilterColumn,
  VehicleListColumn,
  DetailsColumn,
  ColumnPaper,
} from "@/components/vehicles/VehiclePage.styled";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { Vehicle } from "@/entities/types/vehicleTypes";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import { GET_ALL_VEHICLES } from "@/graphql/query/vehicle.query";
import {
  CREATE_VEHICLE,
  UPDATE_VEHICLE,
  DELETE_VEHICLE,
} from "@/graphql/mutation/vehicle.mutation";
import {
  VEHICLE_CREATED_SUBSCRIPTION,
  VEHICLE_UPDATED_SUBSCRIPTION,
  VEHICLE_DELETED_SUBSCRIPTION,
} from "@/graphql/subscription/vehicle.subscription";
import {
  VehicleCreatedData,
  VehicleUpdatedData,
  VehicleDeletedData,
} from "@/entities/types/vehicleTypes";
import Layout from "@/components/appbar/Layout";

type GetAllVehiclesData = {
  getAllVehicles: Vehicle[];
};

function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleColor, setSelectedVehicleColor] = useState<
    string | undefined
  >(undefined);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const { showSnackbar } = useSnackbar();

  // --- Apollo GraphQL hooks ---
  const { data, loading, error, client } =
    useQuery<GetAllVehiclesData>(GET_ALL_VEHICLES);

  const [createVehicle] = useMutation(CREATE_VEHICLE);
  const [updateVehicle] = useMutation(UPDATE_VEHICLE);
  const [deleteVehicle] = useMutation(DELETE_VEHICLE);

  const vehicles: Vehicle[] = data?.getAllVehicles || [];

  const existingIdentifiers = vehicles.map((v) => v.identifier);
  const existingLicencePlates = vehicles.map((v) => v.licencePlate);

  function prepareVehicleInput(vehicle: Vehicle) {
    const { _id, id, createdAt, updatedAt, __typename, documents, ...rest } =
      vehicle;
    return {
      ...rest,
      documents: documents?.map(({ __typename, ...doc }) => doc) || [],
    };
  }

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    const vehicleIndex = vehicles.findIndex((v) => v.id === vehicle.id);
    if (vehicleIndex !== -1) {
      const color = getVehicleColor(vehicleIndex);
      setSelectedVehicleColor(color);
    }
  };

  const handleSaveVehicle = useCallback(
    async (vehicleData: Vehicle) => {
      try {
        // remove assignedJobs before sending to GraphQL
        const { assignedJobs, ...rest } = vehicleData;
        const input = prepareVehicleInput(rest);
        if (vehicleData.id) {
          await updateVehicle({ variables: { id: vehicleData.id, input } });
          showSnackbar(`Vehicle Updated: ${vehicleData.identifier}`);
        } else {
          await createVehicle({ variables: { input } });
          showSnackbar(`Vehicle created: ${vehicleData.identifier}`);
        }
        setIsAddFormOpen(false);
      } catch (err: any) {
        console.error("Error saving vehicle:", err);
        const errorMessage =
          err.graphQLErrors?.[0]?.message || err.message || "Unknown error";
        showSnackbar(
          `Error saving vehicle: ${errorMessage}, ${vehicleData.identifier}`,
          "error"
        );
      }
    },
    [createVehicle, updateVehicle, showSnackbar]
  );

  const handleDeleteVehicle = useCallback(
    async (id: string) => {
      if (!id) {
        showSnackbar("Error: Cannot delete vehicle without an ID.", "error");
        return;
      }
      try {
        const { data }: any = await deleteVehicle({ variables: { id } });
        if (selectedVehicle?.id === id) {
          setSelectedVehicle(null);
        }
        showSnackbar(`Vehicle deleted successfully!`);
      } catch (err: any) {
        console.error("Error deleting vehicle:", err);
        const errorMessage =
          err.graphQLErrors?.[0]?.message || err.message || "Unknown error";
        showSnackbar(`Error deleting vehicle: ${errorMessage}`, "error");
      }
    },
    [deleteVehicle, selectedVehicle, showSnackbar]
  );

  // --- Subscriptions to auto-update cache ---
  useSubscription<VehicleCreatedData>(VEHICLE_CREATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      console.log("Create Subscription fired: vehicleCreated", data);
      const newVehicle = data?.data?.vehicleCreated;
      if (!newVehicle) return;
      client.cache.updateQuery<GetAllVehiclesData>(
        { query: GET_ALL_VEHICLES },
        (existing) => {
          if (!existing) return { getAllVehicles: [newVehicle] };
          if (existing.getAllVehicles.find((v) => v.id === newVehicle.id))
            return existing;
          return { getAllVehicles: [...existing.getAllVehicles, newVehicle] };
        }
      );
    },
  });

  useSubscription<VehicleUpdatedData>(VEHICLE_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      console.log("Update Subscription fired: vehicleUpdated", data);
      const updated = data?.data?.vehicleUpdated;
      if (!updated) return;

      // Update list
      client.cache.updateQuery<GetAllVehiclesData>(
        { query: GET_ALL_VEHICLES },
        (existing) => {
          if (!existing) return { getAllVehicles: [updated] };
          return {
            getAllVehicles: existing.getAllVehicles.map((v) =>
              v.id === updated.id ? { ...v, ...updated } : v
            ),
          };
        }
      );

      if (selectedVehicle?.id === updated.id) {
        setSelectedVehicle((prev) => (prev ? { ...prev, ...updated } : prev));
      }
    },
  });

  useSubscription<VehicleDeletedData>(VEHICLE_DELETED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const deletedId = data?.data?.vehicleDeleted;
      if (!deletedId) return;
      client.cache.updateQuery<GetAllVehiclesData>(
        { query: GET_ALL_VEHICLES },
        (existing) => {
          if (!existing) return { getAllVehicles: [] };
          return {
            getAllVehicles: existing.getAllVehicles.filter(
              (v) => v.id !== deletedId
            ),
          };
        }
      );
      if (selectedVehicle?.id === deletedId) {
        setSelectedVehicle(null);
      }
    },
  });

  return (
    <Layout>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Head>
          <title>Vehicles Management</title>
          <meta
            name="description"
            content="Professional Vehicle Management System for fleet tracking and maintenance"
          />
        </Head>
        <MainContainer>
          <GridContainer container spacing={0}>
            <FilterColumn size={{ xs: 12, sm: 3 }}>
              <ColumnPaper elevation={0}>
                <VehicleFilters onOpenForm={() => setIsAddFormOpen(true)} />
              </ColumnPaper>
            </FilterColumn>

            <VehicleListColumn size={{ xs: 12, sm: 3 }}>
              <ColumnPaper elevation={0}>
                {/* Conditional rendering for loading, error, and no vehicles */}
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Box sx={{ p: 3 }}>
                    <Typography color="error" variant="body1">
                      Error loading vehicles: {error.message}
                    </Typography>
                  </Box>
                ) : vehicles.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary">
                      No vehicles found.
                    </Typography>
                  </Box>
                ) : (
                  <VehicleList
                    vehicles={vehicles}
                    onSelectVehicle={handleSelectVehicle}
                    selectedVehicle={selectedVehicle}
                  />
                )}
              </ColumnPaper>
            </VehicleListColumn>

            <DetailsColumn size={{ xs: 12, sm: 6 }}>
              <ColumnPaper elevation={0}>
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Box sx={{ p: 3 }}>
                    <Typography color="error" variant="body1">
                      Error loading details.
                    </Typography>
                  </Box>
                ) : (
                  <VehicleDetails
                    vehicle={selectedVehicle}
                    onEditVehicle={handleSaveVehicle}
                    onDeleteVehicle={handleDeleteVehicle}
                    vehicleColor={selectedVehicleColor}
                  />
                )}
              </ColumnPaper>
            </DetailsColumn>
          </GridContainer>
        </MainContainer>

        <AddVehicleForm
          open={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onSave={handleSaveVehicle}
          entityData={null}
          existingIdentifiers={existingIdentifiers}
          existingLicencePlates={existingLicencePlates}
        />
      </LocalizationProvider>
    </Layout>
  );
}

// Wrap the page to enforce authentication
export const getServerSideProps = withPageAuthRequired();

export default VehiclesPage;
