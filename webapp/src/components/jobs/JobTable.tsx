import { useState, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type {
  ColDef,
  GridReadyEvent,
  CellContextMenuEvent,
} from "ag-grid-community";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useJobs } from "@/contexts/JobsContext";
import Loader from "@/components/common/Loader"; 

// Import AG Grid CSS
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

type RowData = Record<string, any>;

const JobTable = () => {
  const { jobs, deleteJob } = useJobs();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [activeRowData, setActiveRowData] = useState<RowData | null>(null);
  const [loading, setLoading] = useState(false); 

  const router = useRouter();

  const rows = useMemo(() => {
    return (jobs || [])
      .map((job) => {
        const safePickupLocation =
          typeof job.pickupLocation === "object" && job.pickupLocation?.label
            ? job.pickupLocation.label
            : "";

        const safeDeliverLocation =
          typeof job.deliverLocation === "object" && job.deliverLocation?.label
            ? job.deliverLocation.label
            : "";

        return {
          ...job,
          jobDate: job.jobDate ? dayjs(job.jobDate).format("MM/DD/YYYY") : "",
          pickupLocation: safePickupLocation,
          deliverLocation: safeDeliverLocation,
        };
      })
      .reverse();
  }, [jobs]);

  const columnDefs = useMemo<ColDef[]>(() => {
    const allColumns: ColDef[] = [
      { headerName: "Job ID", field: "id" },
      { headerName: "Job Reference", field: "jobReference" },
      { headerName: "Job Type", field: "jobType" },
      {
        headerName: "Job Date",
        field: "jobDate",
        filter: "agDateColumnFilter",
        filterParams: {
          // Let user pick using browser calendar
          browserDatePicker: true,
          // Comparator to handle MM/DD/YYYY format
          comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
            if (!cellValue) return -1;
            const [month, day, year] = cellValue.split("/").map(Number);
            const cellDate = new Date(year, month - 1, day);

            // Remove time for accurate comparison
            const filterTime = filterLocalDateAtMidnight.getTime();
            const cellTime = cellDate.setHours(0, 0, 0, 0);

            if (cellTime === filterTime) return 0;
            return cellTime < filterTime ? -1 : 1;
          },
        },
      },
      { headerName: "Billable", field: "billable" },
      { headerName: "Origin", field: "pickupFrom" },
      { headerName: "Origin Address", field: "pickupLocation" },
      { headerName: "Destination", field: "deliverTo" },
      { headerName: "Destination Address", field: "deliverLocation" },
      { headerName: "Fleet", field: "fleet" },
      { headerName: "Shift", field: "shift" },
      { headerName: "Job Status", field: "jobStatus" },
    ];

    return allColumns.map((col) => ({
      ...col,
      sortable: true,
      filter: col.filter ?? true,
      resizable: true,
      minWidth: 200,
      cellRenderer: (params: any) =>
        typeof params.value === "boolean"
          ? params.value
            ? "true"
            : "false"
          : params.value ?? "",
    }));
  }, []);

  // Default column properties
  const defaultColDef = useMemo(
    (): ColDef => ({
      width: 240,
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  // Handle context menu
  const onCellContextMenu = useCallback((event: CellContextMenuEvent) => {
    const mouseEvent = event.event as MouseEvent;
    setActiveRowData(event.data);
    setContextMenuPosition({
      mouseX: mouseEvent.clientX - 2,
      mouseY: mouseEvent.clientY - 4,
    });
  }, []);

  const handleMenuClose = () => {
    setContextMenuPosition(null);
  };

  const handleContextMenuAction = (action: string) => {
    // Edit Logic
    if (action === "Edit" && activeRowData) {
      router.push(`jobs/edit/${activeRowData.id}`);
    }

    // View Logic
    if (action === "View" && activeRowData) {
      router.push(`jobs/view/${activeRowData.id}`);
    }

    // Delete Logic
    if (action === "Delete") {
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (activeRowData?.id) {
      setLoading(true);
      try {
        await deleteJob(activeRowData.id);
      } finally {
        setTimeout(() => {
          setLoading(false); 
        }, 300);
      }
    }
    setDeleteDialogOpen(false);
    setActiveRowData(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <>
      <Loader open={loading} /> 

    <Box sx={{ width: "100%" }} onContextMenu={(e) => e.preventDefault()}>
      {rows.length === 0 ? (
        <Box
          sx={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            color: "#777",
          }}
        >
          No jobs found! Please add a job to see the table.
        </Box>
      ) : (
        <div
          className="ag-theme-material"
          style={{
            height: "90vh",
            width: "100%",
          }}
        >
          <AgGridReact
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellContextMenu={onCellContextMenu}
            suppressContextMenu={true}
            animateRows={true}
            enableCellTextSelection={true}
            onRowClicked={(e) => e.api.deselectAll()}
            getRowHeight={() => 40}
            headerHeight={48}
            suppressRowClickSelection={true}
            suppressRowDeselection={true}
          />
        </div>
      )}

      {/* Context Menu */}
      <Menu
        open={Boolean(contextMenuPosition)}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuPosition
            ? {
                top: contextMenuPosition.mouseY,
                left: contextMenuPosition.mouseX,
              }
            : undefined
        }
      >
        <MenuItem
          onClick={() => handleContextMenuAction("Edit")}
          disabled={activeRowData?.jobStatus === "In Progress"}
        >
          {" "}
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleContextMenuAction("View")}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleContextMenuAction("Delete")}
          // disabled={activeRowData?.jobStatus === "complete"}
        >
          <ListItemIcon>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        slotProps={{
          paper: { sx: { width: "30vw", p: 2 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 400 }}>Delete Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default JobTable;
