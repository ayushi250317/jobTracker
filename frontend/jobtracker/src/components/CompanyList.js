import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement('#root');
const API_BASE_URL =process.env.REACT_APP_URL;
// const API_BASE_URL="https://8w1wjhc1sf.execute-api.us-east-1.amazonaws.com/dev";

const CompanyList = ({ companies,onEdit,onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleDelete = (applicationId) => {
    // Call the delete function passed from the parent
    onDelete(applicationId);
    setOpenDropdown(null);
  };

  const handleCheckSimilarity = async (resumeFileUrl, application_id) => {
    setIsLoading(true);
    setModalIsOpen(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/findSimilarity`,
        { resumeFileUrl, application_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("idToken")}`,
          },
        }
      );
      
      setModalContent(response.data);
    } catch (error) {
      console.error("Error checking similarity:", error.response ? error.response.data : error.message);
      setModalContent({ error: "Failed to check similarity. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const renderPhraseList = (phrases) => (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {phrases.map((phrase, index) => (
        <li key={index} style={{ margin: '5px 0', padding: '5px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
          {phrase}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Applied Companies</h2>
      <table
        style={{ borderCollapse: "collapse", width: "100%", margin: "0 auto" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#008080", color: "white" }}>
            <th>Company Name</th>
            <th>Position</th>
            <th>Applied Date</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Check Similarity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{company.companyName}</td>
              <td style={{ textAlign: "center" }}>{company.position}</td>
              <td style={{ textAlign: "center" }}>{company.appliedDate}</td>
              <td style={{ textAlign: "center" }}>{company.status}</td>
              <td style={{ textAlign: "center" }}>
                <a href={company.resumeFileUrl} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => handleCheckSimilarity(company.resumeFileUrl, company.application_id)}
                >
                  Check Similarity
                </button>
              </td>
              <td style={{ textAlign: "center", position: "relative" }}>
        <button onClick={() => toggleDropdown(index)}>Actions ▼</button>
        {openDropdown === index && (
          <div style={{
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "5px",
            zIndex: 1000,
          }}>
            <button onClick={() => { onEdit(company); setOpenDropdown(null); }}>Edit</button>
            <button onClick={() => handleDelete(company.application_id)}>Delete</button>
          </div>
        )}
      </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying results */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Similarity Results"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          },
        }}
      >
        <h2 style={{ borderBottom: '2px solid #008080', paddingBottom: '10px' }}>Similarity Results</h2>
        {isLoading ? (
          <div>
            <p>Loading...</p>
            <div className="spinner"></div>
          </div>
        ) : modalContent ? (
          <div>
            <h3 style={{ color: '#008080' }}>Similarity Score</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{(modalContent.similarity_score * 1000).toFixed(2)}%</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '48%' }}>
                <h3 style={{ color: '#008080' }}>Resume Phrases</h3>
                {renderPhraseList(modalContent.resume_phrases)}
              </div>
              <div style={{ width: '48%' }}>
                <h3 style={{ color: '#008080' }}>Job Description Phrases</h3>
                {renderPhraseList(modalContent.job_description_phrases)}
              </div>
            </div>
          </div>
        ) : null}
        <button onClick={closeModal} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#008080', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
      </Modal>
    </div>
  );
};

export default CompanyList;