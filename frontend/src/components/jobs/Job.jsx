import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../button/Button";
import { useDispatch } from "react-redux";
import { fetchJobProgress } from "../../slices/jobSlice";

const Job = ({ job, onDelete }) => {

  const dispatch = useDispatch();
  const progressDict = {
    STARTED: 0,
    PENDING: 0,
    SUCCESS: 100,
    FAILURE: 0,
    RETRY: 0,
    REVOKED: 0,
  };

  const statusClassDict = {
    STARTED: "badge-dark",
    PENDING: "badge-warning",
    SUCCESS: "badge-success",
    PROGRESS: "badge-info",
    FAILURE: "badge-danger",
    RETRY: "badge-secondary",
    REVOKED: "badge-secondary",
  };

  const [progress, setProgress] = useState(progressDict[job.status]);
  const [description, setDescription] = useState(job.result);
  const [status, setStatus] = useState(job.status);
  const [outputFile, setOutputFile] = useState(job.output_file);

  useEffect(() => {
    if (!["SUCCESS", "FAILURE"].includes(job.status)){
      dispatch(fetchJobProgress({ jobId: job.task_id }));
    }

  }, [dispatch, job.task_id]); // Dependency on job.task_id


  if (!["SUCCESS", "FAILURE"].includes(job.status)) {
    useEffect(() => {
      const interval = setInterval(() => {
        axios
          .get(`/api/celery-progress/${job.task_id}/`)
          .then((response) => {
            setProgress(response.data.progress.current);
            setStatus(response.data.state);
            setDescription(response.data.progress.description);

            if (response.data.complete && response.data.success) {
              setOutputFile(response.data.result.output_file);
              setProgress(response.data.progress.current);
              setStatus(response.data.result.status);
              setDescription(response.data.result.status);
              clearInterval(interval);
            }
          })
          .catch((error) =>
            console.error("Error fetching job progress:", error)
          );
      }, 2000);

      return () => clearInterval(interval);
    }, [job.id]);
  }

  return (
    <tr className="job-row shadow-sm">
      <td className="job-id fw-bold">{job.id}</td>
      <td>
        <span className={`badge badge-pill ${statusClassDict[status]} px-3 py-2`}>
          {status}
        </span>
      </td>
      <td className="w-50">
        <div className="progress rounded-pill">
          <div
            className={`progress-bar progress-bar-striped ${
              progress === 100 ? "bg-success" : "bg-info"
            }`}
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
        <small className="text-muted mt-1 d-block">{description}</small>
      </td>
      <td>
        {outputFile && (
          <>
            <a
              href={outputFile}
              className="btn btn-outline-success btn-sm shadow-sm"
              download
            >
              Download
            </a>
            <Button
              text="Delete"
              type="button"
              className="btn btn-outline-danger mb-2 mx-2 btn-sm shadow-sm"
              onClick={() => onDelete(job.id)}
            />
          </>
        )}
      </td>
    </tr>
  );
};

export default Job;
