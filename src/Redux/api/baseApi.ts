import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const BASEURL = "https://quickhire-backend-beta.vercel.app/api/";
//"https://quickhire-backend-beta.vercel.app/api/v1/";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASEURL,
    prepareHeaders: (headers) => {
      const authString = localStorage.getItem("quick_huire");
      const auth = authString ? JSON.parse(authString) : null;
      const token = auth ? auth.accessToken : null;
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["jobs", "applications"],
});

export default baseApi;