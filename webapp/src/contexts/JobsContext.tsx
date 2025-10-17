import React, { createContext, useContext, useEffect, useState } from "react";
import type IJobFormState from "@/entities/types/jobTypes";
import { useSnackbar } from "./SnackbarContext";

import { GET_JOBS, GET_JOB_BY_ID } from "@/graphql/query/job.query";
import {
  CREATE_JOB,
  UPDATE_JOB,
  DELETE_JOB,
} from "@/graphql/mutation/job.mutation";
import {
  JOB_CREATED,
  JOB_UPDATED,
  JOB_DELETED,
} from "@/graphql/subscription/job.subscription";

import {
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client/react";

import { useUser } from "@auth0/nextjs-auth0/client";

interface JobsContextType {
  jobs: IJobFormState[];
  addJob: (job: IJobFormState | IJobFormState[]) => Promise<void>;
  updateJob: (job: IJobFormState) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  getJobById: (jobId: string) => Promise<IJobFormState | null>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useUser();
  const { showSnackbar } = useSnackbar();

  //  Fetch jobs
  const { data, error } = useQuery<{ jobs: IJobFormState[] }>(GET_JOBS, {
    fetchPolicy: "network-only", // Always fresh data
    skip: isLoading || !user, // skip query if no user
  });

  const [jobs, setJobs] = useState<IJobFormState[]>([]);

  useEffect(() => {
    if (data?.jobs) {
      setJobs(data.jobs);
    } else if (!isLoading && user) {
      setJobs([]);
    }
  }, [data, user, isLoading]);

  useEffect(() => {
    if (error) {
      showSnackbar(error.message ?? "Error fetching jobs", "error");
    }
  }, [error, showSnackbar]);

  // Subscriptions
  useSubscription<{ jobCreated: IJobFormState }>(JOB_CREATED, {
    onData: ({ data }) => {
      const job = data.data?.jobCreated;
      if (job) {
        setJobs((prev) => {
          const exists = prev.some((j) => j.id === job.id);
          if (exists) {
            return prev.map((j) => (j.id === job.id ? job : j));
          }
          return [...prev, job];
        });
      }
    },
  });

  useSubscription<{ jobUpdated: IJobFormState }>(JOB_UPDATED, {
    onData: ({ data }) => {
      const job = data.data?.jobUpdated;
      if (job) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
      }
    },
  });

  useSubscription<{ jobDeleted: string }>(JOB_DELETED, {
    onData: ({ data }) => {
      const deletedId = data.data?.jobDeleted;
      if (deletedId) {
        setJobs((prev) => prev.filter((j) => j.id !== deletedId));
      }
    },
  });

  // Mutations
  const [createJobMutation] = useMutation<{ createJob: IJobFormState }>(
    CREATE_JOB
  );
  const [updateJobMutation] = useMutation<{ updateJob: IJobFormState }>(
    UPDATE_JOB
  );
  const [deleteJobMutation] = useMutation<{ deleteJob: { id: string } }>(
    DELETE_JOB
  );

  //  Lazy query for job by ID
  const [fetchJobById] = useLazyQuery<{ job: IJobFormState }>(GET_JOB_BY_ID);

  // Only trigger mutation, let subscription update state
  const addJob = async (newJob: IJobFormState | IJobFormState[]) => {
    try {
      if (Array.isArray(newJob)) {
        for (const job of newJob) {
          await createJobMutation({ variables: { input: job } });
        }
        showSnackbar("Job added", "success");
      } else {
        await createJobMutation({ variables: { input: newJob } });
        showSnackbar("Job added", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message ?? "Error adding job", "error");
      throw error;
    }
  };

  const updateJob = async (updatedJob: IJobFormState) => {
    try {
      if (!updatedJob.id) throw new Error("Job id is required for update");

      // Utility to recursively remove __typename and id fields
      // and only convert actual Date objects or valid ISO date strings
      const omitTypename = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(omitTypename);
        } else if (obj instanceof Date) {
          // Convert Date object to ISO string
          return obj.toISOString();
        } else if (
          typeof obj === "string" &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(obj)
        ) {
          // Convert only valid ISO date strings
          return new Date(obj).toISOString();
        } else if (obj && typeof obj === "object") {
          const { __typename, id, ...rest } = obj;
          return Object.keys(rest).reduce((acc, key) => {
            acc[key] = omitTypename(rest[key]);
            return acc;
          }, {} as any);
        }
        return obj;
      };

      // Clean the job object
      const sanitizedInput = omitTypename(updatedJob);

      // Call mutation with sanitized input
      await updateJobMutation({
        variables: { id: updatedJob.id, input: sanitizedInput },
      });

      showSnackbar("Job updated", "success");
    } catch (error: any) {
      showSnackbar(error.message ?? "Error updating job", "error");
      throw error;
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      await deleteJobMutation({ variables: { id: jobId } });
      showSnackbar("Job deleted", "success");
    } catch (error: any) {
      showSnackbar(error.message ?? "Error deleting job", "error");
      throw error;
    }
  };

  const getJobById = async (jobId: string): Promise<IJobFormState | null> => {
    try {
      const { data } = await fetchJobById({
        variables: { id: jobId },
      });
      return data?.job ?? null;
    } catch (error: any) {
      // Ignore Apollo cancellation errors
      if (error.name === "AbortError") {
        return null;
      }
      showSnackbar(error.message ?? "Error fetching job", "error");
      return null;
    }
  };

  return (
    <JobsContext.Provider
      value={{ jobs, addJob, updateJob, deleteJob, getJobById }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be used inside JobsProvider");
  return context;
};
