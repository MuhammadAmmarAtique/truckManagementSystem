import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
  createTheme,
  Dialog,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import type { SxProps, Theme } from "@mui/material/styles";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import type IJobFormState from "@/entities/types/jobTypes";
import MapContainer from "@/components/jobs/viewJobPageComponent/MapContainer";
import { useRouter } from "next/router";
import { useJobs } from "@/contexts/JobsContext";
import Layout from "@/components/appbar/Layout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Loader from "@/components/common/Loader"; // 👈 import loader

interface DetailRowProps {
  label: string;
  value: string | number;
  labelSx?: SxProps<Theme>;
  panel: "left" | "right";
}

const TabPanel: React.FC<{
  value: number;
  index: number;
  children: React.ReactNode;
}> = ({ value, index, children }) => {
  return value === index ? <Box sx={{ p: 2 }}>{children}</Box> : null;
};

// Overriding default MUI body2 typography specifically for the left panel theme
const myTheme = createTheme({
  typography: {
    body2: {
      color: "#00000099",
    },
  },
});

const ViewJobPage: React.FC = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabIndex, setTabIndex] = useState(0);
  const [job, setJob] = useState<IJobFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const { getJobById } = useJobs();

  const [previewImg, setPreviewImg] = useState<{
    url: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (jobId && typeof jobId === "string") {
      const fetchJob = async () => {
        setLoading(true);
        try {
          const fetchedJob = await getJobById(jobId);
          setJob(fetchedJob);
        } catch (error) {
          console.error("Error fetching job:", error);
          setJob(null);
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        }
      };
      fetchJob();
    }
  }, [jobId, getJobById]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "document";
    link.click();
  };

  if (loading) {
    return (
      <Layout>
        <Loader open={true} color="primary" />
      </Layout>
    );
  }

  if (!job) {
    return (
      <Box p={4}>
        <Typography variant="h6">No job found.</Typography>
      </Box>
    );
  }

  // Small DetailRow component using inside Left & Right panel for code reusability.
  const DetailRow: React.FC<DetailRowProps> = ({
    label,
    value,
    labelSx,
    panel,
  }) => {
    if (panel === "left") {
      return (
        <>
          <Typography variant="h6" sx={labelSx}>
            {label}
          </Typography>
          <Typography variant="body2">{value ?? "N/A"}</Typography>
        </>
      );
    }

    // Right panel layout
    return (
      <>
        <Grid size={{ xs: 4 }} textAlign="right">
          <Typography variant="body1" fontWeight="bold" sx={labelSx}>
            {label}:
          </Typography>
        </Grid>
        <Grid size={{ xs: 8 }}>
          <Typography variant="body1">{value ?? "N/A"}</Typography>
        </Grid>
      </>
    );
  };

  return (
    <Layout>
      <Box
        sx={{
          pt: 1,
          pl: 1,
          backgroundColor: "#E1EAF2",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <Grid container spacing={1}>
          {/* LEFT PANEL */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ThemeProvider theme={myTheme}>
              <Paper sx={{ px: 2, textAlign: "center" }}>
                <Box sx={{ py: 4 }}>
                  <Typography variant="h6">Job Details</Typography>
                  <Typography variant="body2" sx={{ color: "#00000099" }}>
                    Job Reference: {job.jobReference} | Job ID: {job.id}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ py: 4 }}>
                  <DetailRow
                    label="Billable"
                    value={job.billable ?? "-"}
                    panel="left"
                  />
                  <DetailRow
                    label="Origin Address"
                    value={job.pickupLocation?.label ?? "-"}
                    labelSx={{ mt: 2 }}
                    panel="left"
                  />
                  <DetailRow
                    label="Destination Address"
                    value={job.deliverLocation?.label ?? "-"}
                    labelSx={{ mt: 2 }}
                    panel="left"
                  />
                  <MapContainer latitude={37.7749} longitude={-122.4194} />
                </Box>
                <Divider />

                <Box sx={{ py: 4 }}>
                  <DetailRow
                    label="Items"
                    value={
                      job.itemsList && job.itemsList.length > 0
                        ? job.itemsList
                            .map(
                              (item) => `${item.qty} ${item.unit} ${item.name}`
                            )
                            .join(", ")
                        : "-"
                    }
                    panel="left"
                  />
                  <DetailRow label="Job Comments" value="-" panel="left" />
                  <DetailRow
                    label="Current Status"
                    value={job.jobStatus ?? "-"}
                    panel="left"
                  />
                  <DetailRow label="Vehicle" value="-" panel="left" />
                  <DetailRow
                    label="Fleet"
                    value={job.fleet || "-"}
                    panel="left"
                  />
                  <DetailRow
                    label="Shift"
                    value={job.shift || "-"}
                    panel="left"
                  />
                  <DetailRow label="Trailer" value="-" panel="left" />
                  <DetailRow label="Driver" value="-" panel="left" />
                  <DetailRow
                    label="Job Date"
                    value={
                      job.jobDate
                        ? new Date(job.jobDate).toLocaleDateString("en-US")
                        : "N/A"
                    }
                    panel="left"
                  />
                  <Divider sx={{ mt: 2 }} />
                </Box>
              </Paper>
            </ThemeProvider>
          </Grid>

          {/* RIGHT PANEL */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 2 }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
              >
                <Tab label="Timeline" />
                <Tab label="POP / POD" />
                <Tab label="Details" />
                <Tab label="Custom Fields" />
                <Tab label="Documents" />
                <Tab label="POP/POD Emails" />
              </Tabs>

              <Divider sx={{ my: 1 }} />

              <TabPanel value={tabIndex} index={0}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* Icon Circle */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#ff8039",
                      color: "#fff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    <WhereToVoteIcon />
                  </Box>

                  <Typography variant="body2">
                    Job created <br />
                    {job.jobDate
                      ? new Date(job.jobDate).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Box>
              </TabPanel>

              <TabPanel value={tabIndex} index={1}>
                -
              </TabPanel>

              <TabPanel value={tabIndex} index={2}>
                <Box
                  sx={{
                    minHeight: "50vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Grid container spacing={2} sx={{ maxWidth: 600 }}>
                    <DetailRow
                      label="Job ID"
                      value={job.id ?? "-"}
                      panel="right"
                    />
                    <DetailRow
                      label="Job Reference"
                      value={job.jobReference ?? "-"}
                      panel="right"
                    />
                    <DetailRow
                      label="Billable"
                      value={job.billable ?? "-"}
                      panel="right"
                    />
                    <DetailRow
                      label="Origin"
                      value={job.pickupFrom}
                      panel="right"
                    />
                    <DetailRow
                      label="Origin Address"
                      value={job.pickupLocation?.label ?? ""}
                      panel="right"
                    />
                    <DetailRow
                      label="Destination"
                      value={job.deliverTo}
                      panel="right"
                    />
                    <DetailRow
                      label="Destination Address"
                      value={job.deliverLocation?.label ?? ""}
                      panel="right"
                    />
                    <DetailRow
                      label="Job Date"
                      value={
                        job.jobDate
                          ? new Date(job.jobDate).toLocaleDateString("en-US")
                          : "N/A"
                      }
                      panel="right"
                    />
                    <DetailRow
                      label="Items"
                      value={job.itemsList?.length ?? 0}
                      panel="right"
                    />
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value={tabIndex} index={3}>
                -
              </TabPanel>

              <TabPanel value={tabIndex} index={4}>
                {job.documents && job.documents.length > 0 ? (
                  <Grid container spacing={2}>
                    {job.documents.map((doc, idx) => (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={doc.dataUrl || ""}
                            alt={doc.name || ""}
                            onClick={() =>
                              setPreviewImg({
                                url: doc.dataUrl || "",
                                name: doc.name || "document",
                              })
                            }
                            sx={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 1,
                              boxShadow: 1,
                              cursor: "pointer",
                              transition: "0.2s",
                              "&:hover": { transform: "scale(1.02)" },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              textAlign: "center",
                              wordBreak: "break-word",
                            }}
                          >
                            {doc.name}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No files available
                  </Typography>
                )}

                {/* IMAGE PREVIEW MODAL */}
                <Dialog
                  open={!!previewImg}
                  onClose={() => setPreviewImg(null)}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{
                    sx: {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  }}
                >
                  {previewImg && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* Container around image + button */}
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        {/* Download Button */}
                        <IconButton
                          onClick={() =>
                            handleDownload(previewImg.url, previewImg.name)
                          }
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>

                        {/* The Image */}
                        <Box
                          component="img"
                          src={previewImg.url}
                          alt={previewImg.name}
                          sx={{
                            maxHeight: "80vh",
                            maxWidth: "90vw",
                            borderRadius: 2,
                            boxShadow: 3,
                            display: "block",
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Dialog>
              </TabPanel>

              <TabPanel value={tabIndex} index={5}>
                -
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ViewJobPage;

export const getServerSideProps = withPageAuthRequired();
