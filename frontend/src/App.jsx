import "./App.css";
import "./styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect,useLayoutEffect } from "react";
import { fetchJobsListAsync } from "./slices/jobSlice";
import JobsList from "./components/jobs/JobsList";

function App() {

  const jobs = useSelector((state) => state.job.jobs);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(fetchJobsListAsync());
  }, []);



  return (
    <>
      <h1>Job Queue</h1>

      <JobsList jobs={jobs} />
    </>
  );
}

export default App;
