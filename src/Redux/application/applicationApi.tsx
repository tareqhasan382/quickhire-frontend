import { baseApi } from "../api/baseApi";

/* ===== Application Entity ===== */
export interface Application {
  _id: string;
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
  createdAt: string;
  updatedAt: string;
}

/* ===== API Responses ===== */
export interface ApplicationsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: Application[];
}

export interface ApplicationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Application;
}

/* ===== Application API ===== */
export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ===== Create Application ===== */
    createApplication: builder.mutation<ApplicationResponse, Partial<Application>>({
      query: (data) => ({
        url: "/applications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),

    /* ===== Get All Applications ===== */
    getApplications: builder.query<ApplicationsResponse, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/applications",
        method: "GET",
        params,
      }),
      providesTags: ["applications"],
    }),

    /* ===== Get Single Application ===== */
    getApplicationById: builder.query<ApplicationResponse, string>({
      query: (id) => `/applications/${id}`,
      providesTags: ["applications"],
    }),

    /* ===== Update Application ===== */
    updateApplication: builder.mutation<ApplicationResponse, { id: string; data: Partial<Application> }>({
      query: ({ id, data }) => ({
        url: `/applications/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),

    /* ===== Delete Application ===== */
    deleteApplication: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["applications"],
    }),
  }),
});

/* ===== Export Hooks ===== */
export const {
  useCreateApplicationMutation,
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = applicationApi;