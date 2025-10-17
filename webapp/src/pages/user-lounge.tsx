import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import Layout from "@/components/appbar/Layout";
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function UserLounge() {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f4f6f8",
          p: 2,
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            boxShadow: 3,
          }}
        >
          {/* Avatar */}
          <Avatar
            src={user.picture || ""}
            alt={user.nickname || "User"}
            sx={{ width: 100, height: 100, mb: 2, mx: "auto" }}
          />

          <Typography variant="h6" sx={{ mb: 3 }}>
            User Information
          </Typography>

          {/* User details */}
          <Stack spacing={2} divider={<Divider />}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Name:
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email:
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nickname:
              </Typography>
              <Typography variant="body1">{user.nickname}</Typography>
            </Box>
          </Stack>

          {/* Back button */}
          <Button
            component={Link}
            href="/"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, borderRadius: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
