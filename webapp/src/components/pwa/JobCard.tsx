import React, { useRef, useState, useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface Job {
  id: string;
  jobReference?: string | null;
  pickupLocation?: { value: string; label: string } | null;
  deliverLocation?: { value: string; label: string } | null;
  itemsList?: { name: string; qty: number; unit: string }[];
}

interface JobCardProps {
  job: Job;
  onSwipeRight: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSwipeRight }) => {
  const startXRef = useRef<number | null>(null); //holds horizantal position where user first touches/drag
  const [dragX, setDragX] = useState(0);
  const isDraggingRef = useRef(false); //flag to know if user is dragging right now or not
  const threshold = 120;

  // touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const delta = e.touches[0].clientX - startXRef.current;
    setDragX(delta > 0 ? Math.min(delta, 300) : Math.max(delta, -30));
  };
  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (dragX > threshold) {
      onSwipeRight(job);
    }
    setDragX(0);
    startXRef.current = null;
  };

  // mouse handlers (desktop)
  useEffect(() => {
    const handleMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || startXRef.current === null) return;
      const clientX = moveEvent.clientX;
      const delta = clientX - startXRef.current;
      setDragX(delta > 0 ? Math.min(delta, 300) : Math.max(delta, -30));
    };
    const handleUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (dragX > threshold) {
        onSwipeRight(job);
      }
      setDragX(0);
      startXRef.current = null;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragX, job, onSwipeRight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      sx={{
        marginBottom: 2,
        userSelect: "none",
      }}
    >
      <Card
        sx={{
          backgroundColor: "#64A5D7",
          borderRadius: "20px",
          color: "white",
          transform: `translateX(${dragX}px)`,
          transition: isDraggingRef.current ? "none" : "transform 200ms ease",
          boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" gutterBottom fontWeight="bold" mb={1}>
            {job.jobReference ?? `Job ${job.id}`}
          </Typography>

          <Typography variant="body2" fontWeight={300} mb={1}>
            {job.pickupLocation?.label ?? "No delivery location"}
          </Typography>

          <Typography variant="body2" fontWeight={300} mb={1}>
            {job.deliverLocation?.label ?? "No delivery location"}
          </Typography>

          <Typography variant="body2" mb={1}>
            {job?.itemsList?.length === 0
              ? "0 items"
              : `${job.itemsList?.length} x items`}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobCard;
