import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormContext, Controller } from "react-hook-form";
import { maxFileSize, allowedTypes } from "@/utils/jobConstants";
import { useFormDisable } from "@/contexts/FormDisableContext";

const Documents: React.FC = () => {
  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const documents = watch("documents") || [];
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle file upload
  const handleFile = (selectedFile: File) => {
    const extension = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;

    if (!allowedTypes.includes(extension)) {
      setLocalError(
        `File type not allowed. Allowed: ${allowedTypes.join(", ")}`
      );
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setLocalError(`File exceeds size limit (4MB): ${selectedFile.name}`);
      return;
    }

    setLocalError(null);

    // Convert file → base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const newDoc = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        dataUrl: e.target?.result as string,
        description: "",
      };

      const currentDocs = watch("documents") || [];
      setValue("documents", [...currentDocs, newDoc], { shouldValidate: true });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (getDisabled("documents")) return;
    const files = Array.from(e.dataTransfer.files || []);
    files.forEach(handleFile);
    e.dataTransfer.clearData();
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(handleFile);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const updated = documents.filter((_: any, i: number) => i !== index);
    setValue("documents", updated, { shouldValidate: true });
  };

  const disableAllExceptReference = useFormDisable();
  const getDisabled = (field: string) =>
    disableAllExceptReference && field !== "jobReference";

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        p: 2,
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 400 }}>
        Documents
      </Typography>

      {(errors.documents?.message || localError) && (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {(errors.documents?.message as string) || localError}
        </Typography>
      )}

      {/* Render uploaded docs */}
      {documents.map((doc: any, index: number) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            pb: 1,
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* Description field */}
          <Controller
            name={`documents.${index}.description`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                placeholder="Description"
                variant="outlined"
                sx={{ flex: 1, mr: 2 }}
                disabled={getDisabled("document description")}
              />
            )}
          />

          {/* File name */}
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              textAlign: "left",
            }}
          >
            {doc.name}
          </Typography>

          <IconButton
            size="small"
            onClick={() => removeFile(index)}
            disabled={getDisabled("document cross button")}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      {/* Drop zone */}
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => {
          if (getDisabled("documents")) return;
          document.getElementById("fileInput")?.click();
        }}
        sx={{
          borderRadius: "8px",
          p: { xs: 2, sm: 4 },
          textAlign: "center",
          cursor: "pointer",
          width: "100%",
          backgroundColor: "#F1F0EF",
        }}
      >
        <Typography variant="body1" noWrap={false}>
          Drag & drop or click to browse
        </Typography>
        <input
          id="fileInput"
          type="file"
          accept={allowedTypes.join(",")}
          style={{ display: "none" }}
          onChange={handleBrowse}
          multiple
          disabled={getDisabled("documents")}
        />
      </Box>
    </Box>
  );
};

export default Documents;
