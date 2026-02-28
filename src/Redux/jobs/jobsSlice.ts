import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { JobQueryParams } from "./jobsApi";

interface JobsState {
  filters: JobQueryParams;
}

const initialState: JobsState = {
  filters: {
    title: "",
    location: "",
    page: 1,
    limit: 9,
  },
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setTitleFilter: (state, action: PayloadAction<string>) => {
      state.filters.title = action.payload;
      state.filters.page = 1;
    },
    setLocationFilter: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setTitleFilter, setLocationFilter, setPage, resetFilters } =
  jobsSlice.actions;
export default jobsSlice.reducer;