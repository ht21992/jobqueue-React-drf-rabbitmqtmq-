import React, { useState, useCallback } from "react";
import Job from "./Job";
import { addJobAsync, deleteJobAsync } from "../../slices/jobSlice";
import { useDispatch } from "react-redux";
import Button from "../button/Button";
import Input from "../input/Input";

const JobsList = ({ jobs }) => {
  const dispatch = useDispatch();
  const [inputFile, setInputFile] = useState(null);
  const [conversionFormat, setConversionFormat] = useState();
  const [availableFormats, setAvailableFormats] = useState([]);

  const handleDeleteJob = useCallback((jobId) => {
    dispatch(deleteJobAsync(jobId)).catch((error) =>
      console.error(`Failed to delete job - ${jobId}:`, error)
    );
  }, []);

  const handleAddJob = () => {
    if (availableFormats.length === 0 || !conversionFormat) return;

    if (inputFile) {
      dispatch(addJobAsync(inputFile, conversionFormat))
        .then(() => {
          setInputFile(null);
          setConversionFormat("");
          setAvailableFormats([]);
        })
        .catch((error) => console.error("Failed to add job:", error));
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setInputFile(file);

    // Determine the available formats based on file type
    if (file) {
      const mimeType = file.type;
      const fileFormat = mimeType.split("/").reverse()[0];

      if (mimeType.startsWith("image/")) {
        const imgFormats = ["png", "jpeg", "webp"].filter(
          (f) => f !== fileFormat
        );
        setAvailableFormats(imgFormats);
        setConversionFormat(imgFormats[0]);
      } else if (mimeType.startsWith("video/")) {
        const videFormats = ["mp4", "avi"].filter((f) => f !== fileFormat);
        setAvailableFormats(videFormats);
        setConversionFormat(videFormats[0]);
      } else {
        setAvailableFormats([]);
      }
    }
  };
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 ">
          <div className="card shadow-lg p-4 mb-4">
            <div className="d-flex justify-content-around align-items-center">
              <div className="custom-file mb-2 mx-2">
                <Input
                  type="file"
                  className="custom-file-input px-2"
                  id="inputFile"
                  onChange={(e) => onFileChange(e)}
                  required
                />
                <label className="custom-file-label" htmlFor="inputFile">
                  {inputFile ? inputFile.name : "Choose file"}
                </label>
              </div>
              {availableFormats.length > 0 ? (
                <>
                  <select
                    className="form-select w-auto mx-2"
                    value={conversionFormat}
                    onChange={(e) => setConversionFormat(e.target.value)}
                  >
                    {availableFormats.map((format) => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <Button
                    text="Convert"
                    type="button"
                    className="btn btn-outline-dark shadow-sm"
                    onClick={() => handleAddJob()}
                  />
                </>
              ) : (
                inputFile && (
                  <small className="mb-2 text-danger mx-2">Not Supported</small>
                )
              )}
            </div>
          </div>
        </div>
        {jobs.length > 0 && (
          <table className="table shadow-sm">
            <thead className="table-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Status</th>
                <th scope="col">Progress</th>
                <th scope="col">Output File</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <Job key={job.id} job={job} onDelete={handleDeleteJob} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default JobsList;
