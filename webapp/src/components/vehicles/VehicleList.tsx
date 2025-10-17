import React from "react";
import { Avatar } from "@mui/material";
import ListSection from "./ListSection";
import {
  getVehicleAvatarInitial,
  getVehicleColor,
} from "@/utils/vehicleContants";
import { Vehicle } from "@/entities/types/vehicleTypes";

interface VehicleListProps {
  vehicles?: Vehicle[]; // may be undefined while loading
  onSelectVehicle: (vehicle: Vehicle) => void;
  selectedVehicle: Vehicle | null;
}

/**
 * Vehicle-specific sort:
 * - Compare numeric portion of `identifier` first (ascending)
 * - If only one has a numeric part, that one comes first
 * - If both lack numeric part, fallback to `id` string compare
 */
const vehicleSortFn = (a: Vehicle, b: Vehicle) => {
  const getNumber = (identifier?: string) => {
    const match = (identifier || "").match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const numA = getNumber(a.identifier);
  const numB = getNumber(b.identifier);

  if (numA !== null && numB === null) return -1;
  if (numA === null && numB !== null) return 1;

  if (numA !== null && numB !== null) return numA - numB;

  return String(a.id || "").localeCompare(String(b.id || ""));
};

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles = [],
  onSelectVehicle,
  selectedVehicle,
}) => {
  return (
    <ListSection<Vehicle>
      title="Vehicles"
      data={vehicles}
      searchKeys={["identifier", "licencePlate"]}
      onSelect={onSelectVehicle}
      selectedItem={selectedVehicle}
      emptyMessage="Add vehicle to show list"
      sortFn={vehicleSortFn}
      getItemId={(v) => v.id}
      getItemKey={(v, index) => v.id ?? v.identifier ?? v.id ?? index}
      renderAvatar={(v, index) => (
        <Avatar sx={{ bgcolor: getVehicleColor(index), color: "white" }}>
          {getVehicleAvatarInitial(v)}
        </Avatar>
      )}
      renderPrimaryText={(v) => v.identifier || "---"}
      renderSecondaryText={(v) => v.licencePlate || "---"}
    />
  );
};

export default VehicleList;
