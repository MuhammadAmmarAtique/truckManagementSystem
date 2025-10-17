import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Job {
  id: string;
  jobReference: string;
  pickupFrom: string;
  deliverTo: string;
}

interface JobCardProps {
  job: Job;
  isDragging?: boolean;
}

const StyledJobCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  height: '138px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'grab',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
  '&:active': {
    cursor: 'grabbing',
  },
}));

const JobHeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ff9500', // Keep the orange color as per the design
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  fontWeight: 'bold',
  fontSize: '0.85rem',
  textAlign: 'center',
}));

const JobCard: React.FC<JobCardProps> = ({ job, isDragging }) => {
  const theme = useTheme();

  return (
    <StyledJobCard
      sx={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
        boxShadow: isDragging ? theme.shadows[8] : theme.shadows[1],
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      {/* Job Reference Header */}
      <JobHeaderBox>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {job.jobReference}
        </Typography>
      </JobHeaderBox>

      {/* Job Title/Description */}
      <Box sx={{ mb: 1, flexGrow: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: '0.8rem',
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          JD Landscape and Gar...
        </Typography>
      </Box>

      {/* Pickup and Delivery Info */}
      <Box sx={{ mt: 'auto' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            mb: 0.3,
            lineHeight: 1.2,
          }}
        >
          {job.pickupFrom}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            lineHeight: 1.2,
          }}
        >
          {job.deliverTo}
        </Typography>
      </Box>
    </StyledJobCard>
  );
};

export default JobCard;