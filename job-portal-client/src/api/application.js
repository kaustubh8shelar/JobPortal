import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/applications`;

export const getApplications = async (userId) => {
    // console.log("Fetching applications for user ID: " + userId);
    return await axios.get(`${API_BASE_URL}?userId=${userId}`);
};

export const applyForJob = async (applicationData) => {
    const token = localStorage.getItem("token");

    return await axios.post(`${API_BASE_URL}/create`, applicationData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getApplicationsByJobId = async (jobId) => {
    return await axios.get(`${API_BASE_URL}?jobId=${jobId}`);
};

export const updateApplicationStatus  = async (applicationId, newStatus) => {
    return await axios.patch(`${API_BASE_URL}/${applicationId}/${newStatus}`);
};