import React, { useState, useEffect } from "react";
import "./AddCompanyPopup.css";

const AddCompanyPopup = ({ onClose, onSave, initialData }) => {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [appliedDate, setDateApplied] = useState("");
  const [status, setStatus] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [existingResumeUrl, setExistingResumeUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || "");
      setPosition(initialData.position || "");
      // setDateApplied(initialData.appliedDate || "");
      setStatus(initialData.status || "");
      setJobDescription(initialData.jobDescription || "");
      setExistingResumeUrl(initialData.resumeFileUrl || "");
      if (initialData.appliedDate) {
        const date = new Date(initialData.appliedDate);
        setDateApplied(date.toISOString().split('T')[0]);
      } else {
        setDateApplied("");
      }
    }
  }, [initialData]);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    const formData = {
      companyName,
      position,
      appliedDate,
      status,
      username,
      jobDescription,
    };

    if (initialData) {
      formData.application_id = initialData.application_id;
    }

    if (resumeFile) {
      const reader = new FileReader();
      reader.readAsDataURL(resumeFile);
      reader.onload = () => {
        if (reader.readyState === FileReader.DONE) {
          formData.pdfFile = reader.result.split(",")[1];
          onSave(formData);
          onClose();
        }
      };
    } else {
      formData.resumeFileUrl = existingResumeUrl;
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{initialData ? "Edit Company" : "Add Company"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Company Name:
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </label>
          <label>
            Position:
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </label>
          <label>
            Job Description:
            <input
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
            </label>
          <label>
            Date Applied:
            <input
              type="date"
              value={appliedDate}
              onChange={(e) => setDateApplied(e.target.value)}
              required
            />
          </label>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
          <label>
            Upload Resume:
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          {existingResumeUrl && !resumeFile && (
            <p>Current Resume: <a href={existingResumeUrl} target="_blank" rel="noopener noreferrer">View</a></p>
          )}
          <button type="submit">{initialData ? "Update" : "Save"}</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyPopup;