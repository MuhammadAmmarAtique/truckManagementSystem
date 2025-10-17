import React from "react";
import {
  Grid,
  Typography,
  TypographyProps,
  GridSize,
  GridProps,
} from "@mui/material";

interface DetailSectionProps {
  label: string;
  value: string | number | React.ReactNode;
  labelProps?: TypographyProps;
  valueProps?: TypographyProps;
  spacing?: number;
  labelAlignment?: "left" | "right" | "center" | "inherit" | "justify";
  valueAlignment?: "left" | "right" | "center" | "inherit" | "justify";
  labelSize?: GridSize | GridProps["size"];
  valueSize?: GridSize | GridProps["size"];
}

const DetailSection: React.FC<DetailSectionProps> = ({
  label,
  value,
  labelProps = {},
  valueProps = {},
  spacing = 1,
  labelAlignment = "right",
  valueAlignment = "left",
  labelSize = 6,
  valueSize = 6,
}) => {
  return (
    <>
      <Grid size={labelSize} sx={{ textAlign: labelAlignment }}>
        <Typography variant="body1" sx={{ mb: spacing }} {...labelProps}>
          {label}
        </Typography>
      </Grid>
      <Grid size={valueSize} sx={{ textAlign: valueAlignment, pl: 1 }}>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ mb: spacing }}
          {...valueProps}
        >
          {value}
        </Typography>
      </Grid>
    </>
  );
};

export default DetailSection;
