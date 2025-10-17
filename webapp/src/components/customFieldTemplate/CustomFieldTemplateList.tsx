// Left panel view
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
  ListItemButton,
} from "@mui/material";
import { useState, useEffect } from "react";

interface ListItem {
  id: string | null;
  name: string;
}

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddClick: () => void;
  data: ListItem[];
  buttonText?: string;
}

export default function CustomFieldTemplateList({
  selectedId,
  onSelect,
  onAddClick,
  data,
  buttonText = "Add Custom Field Template",
}: Props) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<ListItem[]>(data);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(data);
    } else {
      setFiltered(
        data.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, data]);

  return (
    <Box
      sx={{
        width: 340,
        borderRight: "1px solid #ccc",
        height: "100vh",
        p: 2,
        mt: -7,
      }}
    >
      {/* Add Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={onAddClick}
        sx={{ mb: 2, backgroundColor: "#4492C6" }}
      >
        {buttonText}
      </Button>
      {/* Search input box */}
      <TextField
        placeholder="Search"
        fullWidth
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
      />
      {/* List of filtered items */}
      <List>
        {filtered.length === 0 ? (
          <Typography
            color="textSecondary"
            align="center"
            sx={{ mt: 2, color: "#00000056" }}
          >
            No record found
          </Typography>
        ) : (
          filtered.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={item.id === selectedId}
                onClick={() => onSelect(String(item.id))}
                sx={{ borderRadius: 1 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#003B5C", mr: 1, color: "white" }}>
                    {item.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}
