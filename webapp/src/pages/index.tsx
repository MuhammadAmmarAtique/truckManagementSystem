import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Backdrop,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

interface ContributorProps {
  name: string;
  role: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  onClick?: () => void;
  disabled?: boolean;
}

function ContributorCard({
  name,
  role,
  description,
  image,
  link,
  buttonText,
  onClick,
  disabled,
}: ContributorProps) {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card
        sx={{
          bgcolor: "rgba(255,255,255,0.08)",
          borderRadius: 4,
          textAlign: "center",
          p: 3,
          height: "100%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto",
            mb: 2,
            border: "3px solid rgba(255,255,255,0.4)",
          }}
        >
          <Image src={image} alt={name} width={160} height={120} />
        </Avatar>

        <CardContent>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
            {name}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "rgba(200,200,200,0.9)", mb: 1 }}
          >
            {role}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            {description}
          </Typography>
        </CardContent>

        <Box>
          <Link href={link} passHref style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={onClick}
              disabled={disabled}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 3,
                background:
                  "linear-gradient(45deg, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 90%)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.53)",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                color: "#FFFFFF",
                transition: "all 0.3s ease",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(0, 0, 0, 0.77)",
                  background:
                    "linear-gradient(45deg, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.2) 90%)",
                },
              }}
            >
              {buttonText}
            </Button>
          </Link>
        </Box>
      </Card>
    </Grid>
  );
}

function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta
          name="description"
          content="Unified Dashboard for Jobs and Vehicle Management"
        />
      </Head>

      {/* Loading Overlay */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Video background */}
        <Box
          component="video"
          autoPlay
          loop
          muted
          playsInline
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -2,
          }}
        >
          <source src="/Vehicles-Videos/vehicle-mng-vd.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </Box>

        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, rgba(19, 22, 73, 0.85) 0%, rgba(55, 58, 92, 0.85) 100%)`,
            zIndex: -1,
          }}
        />

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "#FFFFFF",
                fontWeight: 800,
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Job/Vehicle Management Dashboard
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "rgba(165, 165, 165, 1)",
                mb: 6,
                fontWeight: 300,
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.15)",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
              }}
            >
              Manage Jobs and Vehicles in one place
            </Typography>

            {/* Contributors */}
            <Grid container spacing={4} justifyContent="center">
              <ContributorCard
                name="Ammar"
                role="Job Management CRUD Developer"
                description="Developed a Job Management module with full CRUD functionality, integrating GraphQL (Apollo Client/Server) and MongoDB for data persistence. Implemented AG Grid for dynamic job listings, along with Next.js, MUI, React Hook Form, and Yup for responsive UI, form handling, and validation. Secured the module using Auth0-based authentication."
                image="/Jobs-Images/Ammar.jpg"
                link="/jobs"
                buttonText="💼 Manage Jobs"
              />

              <ContributorCard
                name="Haris"
                role="Vehicle Management CRUD Developer"
                description="Built a Vehicle Management module with CRUD operations, leveraging GraphQL (Apollo Client/Server) and MongoDB for structured fleet data management. Designed a responsive Next.js frontend with MUI components for smooth interaction, along with Next.js, MUI, React Hook Form, Yup for responsive UI and integrated Auth0 for authentication and role-based access control."
                image="/Vehicles-Images/Haris.png"
                link="/vehicles"
                buttonText="🚗 Manage Vehicles"
                onClick={() => setLoading(true)}
                disabled={loading}
              />
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();

export default Home;
