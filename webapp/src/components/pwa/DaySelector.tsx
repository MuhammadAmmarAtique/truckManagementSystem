import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { format } from "date-fns";

interface DaySelectorProps {
  days: Date[];
  startIndex: number;
  today: Date;
  onPrev: () => void;
  onNext: () => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  startIndex,
  today,
  onPrev,
  onNext,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "40px 1fr 40px", sm: "50px 1fr 50px" },
        alignItems: "center",
        backgroundColor: "#00263A",
        p: { xs: 1, sm: 2 },
        width: "100%",
        gap: 1,
      }}
    >
      {/* Left Arrow */}
      <IconButton
        onClick={onPrev}
        disabled={startIndex === 0}
        sx={{ color: "white" }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Days Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: { xs: 1, sm: 2 },
          width: "100%",
        }}
      >
        {days.slice(startIndex, startIndex + 3).map((day, idx) => {
          const isToday = format(day, "dd-MM-yy") === format(today, "dd-MM-yy");
          return (
            <Box
              key={idx}
              sx={{
                backgroundColor: isToday ? "#64A5D7" : "#00263A",
                border: isToday ? "none" : "1px solid #64A5D7",
                borderRadius: 2,
                p: { xs: "0.2rem", sm: "0.4rem" },
                textAlign: "center",
                color: "white",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}
              >
                {format(day, "EEE")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.65rem", sm: "0.85rem" } }}
              >
                {format(day, "dd-MM-yy")}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={onNext}
        disabled={startIndex >= days.length - 3}
        sx={{ color: "white" }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default DaySelector;
