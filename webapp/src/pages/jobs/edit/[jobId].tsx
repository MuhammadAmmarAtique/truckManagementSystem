import React, { useEffect, useState, useRef } from "react";
import JobForm from "@/components/jobs/jobFormComponents/JobForm";
import type IJobFormState from "@/entities/types/jobTypes";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useJobs } from "@/contexts/JobsContext";
import Layout from "@/components/appbar/Layout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Loader from "@/components/common/Loader";

const EditJobPage: React.FC = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { getJobById } = useJobs();

  const [jobData, setJobData] = useState<IJobFormState | null>(null);
  const [isCompletedJob, setIsCompletedJob] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const fetchedRef = useRef(false); // prevents duplicate fetches

  useEffect(() => {
      if (!router.isReady || !jobId || fetchedRef.current) return;

      const fetchJob = async () => {
        fetchedRef.current = true; // block next run
        setIsLoading(true);
        setHasFetched(false);
        try {
          const job = await getJobById(jobId as string);
          if (job) {
            setJobData(job);
            setIsCompletedJob(job.jobStatus === "complete");
          } else {
            setJobData(null);
          }
        } catch (error) {
          console.error("Failed to fetch job:", error);
          setJobData(null);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
            setHasFetched(true);
          }, 300);
        }
      };
      fetchJob();
    }, [router.isReady, jobId, getJobById]);

  // block render before router ready
  if (!router.isReady) return <Loader open={true} color="primary" />;

  return (
    <Layout>
      <Loader open={isLoading} color="primary" />

      {jobData && !isLoading ? (
        <JobForm
          open={true}
          onClose={() => window.history.back()}
          initialDataForEdit={jobData}
          isEdit={true}
          asPage={true}
          disableAllExceptReference={isCompletedJob}
        />
      ) : (
        hasFetched &&
        !isLoading && (
          <Typography variant="body1" sx={{ p: 2 }}>
            Job data not found.
          </Typography>
        )
      )}
    </Layout>
  );
};

export default EditJobPage;

export const getServerSideProps = withPageAuthRequired();
