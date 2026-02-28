import { baseApi } from "../api/baseApi";

export type JobQueryParams = {
  limit?: number;
  page?: number;
  title?: string;
  location?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
};

/* ===== Job Entity ===== */
export interface Job {
  _id: string;
  user_id: string;
  title: string;
  company: string;
  location: {
    type: string;
    city?: string;
    country?: string;
  };
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}


/* ===== API Response ===== */
export interface JobsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Job[];
}
export interface JobResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Job;
}
export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ===== Get All Jobs ===== */
    getJobs: builder.query<JobsResponse, JobQueryParams>({
      query: (params) => ({
        url: "/job",
        method: "GET",
        params,
      }),
      providesTags: ["jobs"],
    }),

    /* ===== Get Single Job ===== */
    getJobById: builder.query<JobResponse, string>({
      query: (id) => `/job/${id}`,
      providesTags: ["jobs"],
    }),

    /* ===== Create Job (Admin) ===== */
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (data) => ({
        url: "/job",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["jobs"],
    }),

    /* ===== Update Job ===== */
    updateJob: builder.mutation<Job, { id: string; data: Partial<Job> }>({
      query: ({ id, data }) => ({
        url: `/job/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["jobs"],
    }),

    /* ===== Delete Job ===== */
    deleteJob: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/job/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["jobs"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;