import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouter } from "next/router";

const PageNotFound: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f5f5f5"
      px={2}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h3" gutterBottom color="text.primary">
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default PageNotFound;
