import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCompanyPopup from "./AddCompanyPopup";
import { useNavigate } from "react-router-dom";
import CompanyList from "./CompanyList";

const API_BASE_URL =
  process.env.REACT_APP_URL;
// const API_BASE_URL="https://8w1wjhc1sf.execute-api.us-east-1.amazonaws.com/dev";

const LandingPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchCompanies = async () => {
    try {
      let username = localStorage.getItem("username");
      const response = await axios.get(
        `${API_BASE_URL}/fetchApplications/${username}`,
        {
          headers: {
            Authorization: localStorage.getItem("idToken"),
          },
        }
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const addOrUpdateCompany = async (application) => {
    try {
      if (editingCompany) {
        // Update existing application
        await axios.post(`${API_BASE_URL}/editApplication`, application, {
          headers: {
            Authorization: localStorage.getItem("idToken"),
          },
        });
      } else {
        // Add new application
        await axios.post(`${API_BASE_URL}/createApplication`, application, {
          headers: {
            Authorization: localStorage.getItem("idToken"),
          },
        });
      }
      fetchCompanies();
      setIsPopupOpen(false);
      setEditingCompany(null);
    } catch (error) {
      console.error("Error adding/updating company:", error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsPopupOpen(true);
  };

  const handleDelete = async (application_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteApplication/${application_id}`, {
        headers: {
          Authorization: localStorage.getItem("idToken"),
        },
      });
      fetchCompanies(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting company:", error);
      // Optionally, you can add user feedback here (e.g., show an error message)
    }
  };
  return (
    <div className="App">
      <div className="header">
        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <CompanyList
        companies={companies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {isPopupOpen && (
        <AddCompanyPopup
          onClose={() => {
            setIsPopupOpen(false);
            setEditingCompany(null);
          }}
          onSave={addOrUpdateCompany}
          initialData={editingCompany}
        />
      )}
      <button
        className="add-company-button"
        onClick={() => setIsPopupOpen(true)}
      >
        Add Company
      </button>
    </div>
  );
};

export default LandingPage;
