import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "@/components/appbar/Layout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { CircularProgress, Box } from "@mui/material";

// Dynamically import JobTable with a fallback loader
const JobTable = dynamic(() => import("@/components/jobs/JobTable"), {
  ssr: false,
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress />
    </Box>
  ),
});

function JobsPage() {
  return (
    <>
      <Head>
        <title>Jobs Management</title>
        <meta
          name="description"
          content="A powerful Jobs Management Dashboard built by Ammar Atique, Software Engineer Intern at Pixako. Add, delete, edit, and view jobs efficiently."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO & Social Sharing */}
        <meta property="og:title" content="Jobs Management" />
        <meta
          property="og:description"
          content="Manage your jobs seamlessly with CRUD functionality and a clean UI."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/icons/job-dashboard.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <JobTable />
      </Layout>
    </>
  );
}

export default JobsPage;

export const getServerSideProps = withPageAuthRequired();
