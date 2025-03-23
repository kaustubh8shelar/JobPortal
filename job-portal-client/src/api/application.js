import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/applications";

export const getApplications = async (userId) => {
    console.log("Fetching applications for user ID: " + userId);
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
