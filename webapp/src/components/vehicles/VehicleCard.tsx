import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Vehicle {
  id: string;
  identifier: string;
  licencePlate: string;
  make: string;
  assignedJobs?: any[];
}

interface VehicleCardProps {
  vehicle: Vehicle;
  borderColor: string;
}

const StyledVehicleCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  height: '138px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
}));

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, borderColor }) => {
  const theme = useTheme();

  return (
    <StyledVehicleCard
      sx={{
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      {/* Vehicle Status Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: theme.palette.error.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${theme.palette.background.paper}`,
            boxShadow: theme.shadows[2],
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: theme.palette.common.white,
            }}
          />
        </Box>
      </Box>

      {/* Vehicle Identifier */}
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: '1.1rem',
          }}
        >
          {vehicle.identifier}
        </Typography>
      </Box>

      {/* Vehicle Details */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
            mb: 0.5,
          }}
        >
          {vehicle.licencePlate}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}
        >
          {vehicle.make}
        </Typography>
      </Box>
    </StyledVehicleCard>
  );
};

export default VehicleCard;