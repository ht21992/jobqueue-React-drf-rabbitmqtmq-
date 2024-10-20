// slices/jobSlice.js

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  jobs: [],
};

export const deleteJobAsync = (jobId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const res = await axios.delete(`api/jobs/${jobId}/`, config);
    if (res.status === 204) {
      dispatch(deleteJob(jobId));
      return Promise.resolve();
    }
  } catch (error) {
    console.log("Failed to delete a job", error);
    return Promise.reject(error);
  }
};

export const addJobAsync =
  (inputFile, conversionFormat) => async (dispatch) => {
    const formData = new FormData();
    formData.append("input_file", inputFile);
    formData.append("conversion_format", conversionFormat);

    try {
      const res = await axios.post("api/jobs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        dispatch(addJob(res.data));
        return Promise.resolve();
      }
    } catch (error) {
      console.error("Failed to add job:", error);
      return Promise.reject(error);
    }
  };

export const fetchJobsListAsync = createAsyncThunk(
  "jobs/fetchJobsListAsync",
  async () => {
    const response = await axios.get("api/jobs/");
    return response.data;
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },
    deleteJob: (state, action) => {
      const jobListArr = state.jobs;
      jobListArr.splice(
        jobListArr.findIndex(({ id }) => id === action.payload),
        1
      );
    },
    setJobProgress: (state, action) => {
      const jobIndex = state.jobs.findIndex(job => job.id === action.payload.jobId);
      if (jobIndex !== -1) {
        state.jobs[jobIndex].progress = action.payload.progress;
        state.jobs[jobIndex].status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsListAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobsListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobsListAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addJob, deleteJob,setJobProgress } = jobSlice.actions;


// New action to fetch job progress
export const fetchJobProgress = (jobId) => ({
  type: 'jobs/fetchJobProgress',
  payload: { jobId },
});

export default jobSlice.reducer;
