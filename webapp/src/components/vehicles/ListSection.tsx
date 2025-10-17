import React, { useMemo, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  IconButton,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTheme } from "@mui/material/styles";
import NoSsr from "@mui/material/NoSsr";
import useSearch, { Searchable } from "@/hooks/useSearch";

export interface ListSectionProps<T> {
  title?: string;

  /** The full list (can be undefined during load; component guards it) */
  data?: T[];

  /** Keys used by the generic search hook */
  searchKeys: (keyof T)[];

  /** Called when a row is clicked */
  onSelect?: (item: T) => void;

  /** Currently selected item (for row highlighting) */
  selectedItem?: T | null;

  /** Custom avatar renderer (optional) */
  renderAvatar?: (item: T, index: number) => React.ReactNode;

  /** Row primary text (required) */
  renderPrimaryText: (item: T) => React.ReactNode;

  /** Row secondary text (optional) */
  renderSecondaryText?: (item: T) => React.ReactNode;

  /** Message when list is empty and no search term */
  emptyMessage?: string;

  /** Optional custom comparator for sorting */
  sortFn?: (a: T, b: T) => number;

  /** How to derive an item's unique id (used for selection + default sort) */
  getItemId?: (item: T) => string | number | undefined;

  /** How to derive the React key for each item */
  getItemKey?: (item: T, index: number) => React.Key;
}

function ListSection<T extends Searchable>({
  title = "Listing",
  data = [],
  searchKeys,
  onSelect,
  selectedItem,
  renderAvatar,
  renderPrimaryText,
  renderSecondaryText,
  emptyMessage = "No records found",
  sortFn,
  getItemId,
  getItemKey,
}: ListSectionProps<T>) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [showList, setShowList] = useState(true);

  // Always pass a safe array to the hook
  const { searchTerm, handleSearchChange, filteredData } = useSearch<T>(
    Array.isArray(data) ? data : [],
    searchKeys
  );

  // Compute a consistent id for selection + default sort
  const idOf = (item?: T | null) =>
    (item && getItemId ? getItemId(item) : (item as any)?.["_id"]) as
      | string
      | number
      | undefined;

  const sortedData = useMemo(() => {
    const base = Array.isArray(filteredData) ? filteredData : [];
    const copy = [...base];

    if (sortFn) {
      copy.sort(sortFn);
    } else {
      // Default: sort by derived id as string
      copy.sort((a, b) =>
        String(idOf(a) ?? "").localeCompare(String(idOf(b) ?? ""))
      );
    }
    return copy;
  }, [filteredData, sortFn]); // idOf stable enough for default

  // Messages
  const dataLen = Array.isArray(data) ? data.length : 0;
  let message: string | null = null;
  if (dataLen === 0 && searchTerm === "") {
    message = emptyMessage;
  } else if ((filteredData?.length ?? 0) === 0 && searchTerm !== "") {
    message = "No records found";
  }

  return (
    <NoSsr>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {isXs && (
          <Box
            onClick={() => setShowList((prev) => !prev)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">View {title}</Typography>
            <IconButton size="small">
              {showList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        )}

        <Collapse in={showList}>
          {/* Sticky search bar */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: theme.palette.background.paper,
              pt: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 1 }}
            />
          </Box>

          {message ? (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          ) : (
            <List dense sx={{ flexGrow: 1, overflowY: "auto" }}>
              {sortedData.map((item, index) => {
                const selected =
                  selectedItem &&
                  idOf(selectedItem) !== undefined &&
                  idOf(selectedItem) === idOf(item);

                const key =
                  getItemKey?.(item, index) ??
                  idOf(item) ??
                  (item as any)?.["id"] ??
                  (item as any)?.["identifier"] ??
                  index;

                return (
                  <ListItem
                    key={key}
                    onClick={() => onSelect?.(item)}
                    sx={{
                      p: { xs: 1 },
                      backgroundColor: selected ? "action.selected" : "inherit",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        cursor: "pointer",
                      },
                    }}
                  >
                    {renderAvatar && (
                      <ListItemAvatar>
                        {renderAvatar(item, index)}
                      </ListItemAvatar>
                    )}

                    <ListItemText
                      primary={renderPrimaryText(item)}
                      secondary={renderSecondaryText?.(item)}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Collapse>
      </Box>
    </NoSsr>
  );
}

export default ListSection;
