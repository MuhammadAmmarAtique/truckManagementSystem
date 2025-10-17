import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import dayjs from "dayjs";
import { Document } from "@/entities/types/vehicleTypes";

interface DocumentsSectionProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  onDocumentClick,
}) => {
  const getFileIcon = (mimeType?: string) => {
    const iconProps = { fontSize: 40, color: "action" as const };

    if (mimeType?.startsWith("image/")) return <ImageIcon sx={iconProps} />;
    if (mimeType === "application/pdf")
      return <PictureAsPdfIcon sx={iconProps} />;
    if (
      mimeType?.includes("wordprocessingml") ||
      mimeType === "application/msword"
    )
      return <ArticleIcon sx={iconProps} />;
    if (
      mimeType?.includes("spreadsheetml") ||
      mimeType === "application/vnd.ms-excel"
    )
      return <AnalyticsIcon sx={iconProps} />;
    if (mimeType?.includes("text/plain"))
      return <TextFieldsIcon sx={iconProps} />;

    return <DescriptionIcon sx={iconProps} />;
  };

  const formatDocumentInfo = (doc: Document) => {
    const info: string[] = [];
    if (doc.name) info.push(doc.name);
    if (doc.documentType) info.push(`Type: ${doc.documentType}`);
    if (doc.documentDate) {
      try {
        const date = dayjs(doc.documentDate).format("MM/DD/YYYY");
        info.push(`Date: ${date}`);
      } catch {
        info.push("Date: ---");
      }
    }
    return info.length > 0 ? info.join(" | ") : "---";
  };

  return (
    <Box sx={{ mb: 1 }}>
      {documents?.length > 0 ? (
        <Stack spacing={0.5}>
          {documents.map((doc, index) => (
            <Box
              key={index}
              onClick={() => onDocumentClick(doc)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "action.hover",
                  borderRadius: 1,
                },
              }}
            >
              {getFileIcon(doc.type)}
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {formatDocumentInfo(doc)}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body1" color="textSecondary">
          ---
        </Typography>
      )}
    </Box>
  );
};

export default DocumentsSection;
