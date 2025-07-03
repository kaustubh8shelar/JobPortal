import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/jobs`; 

export const getJobs = async () => {
    return await axios.get(`${API_BASE_URL}`);
};
  
export const getJobById = async (jobId) => {
    return await axios.get(`${API_BASE_URL}/${jobId}`);
};

export const getRecommendedJobs = (userId) => {
    return axios.get(`${API_BASE_URL}/recommendations/${userId}`);
};

export const getEmployerJobs = (employerId) => {
    return axios.get(`${API_BASE_URL}/employer/${employerId}`);
};

export const createJob = (payload) => {
    const token = localStorage.getItem("token");
    try{
        const res = axios.post(
            `${API_BASE_URL}/create`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error creating job:", error.response?.data || error.message);
        throw error;
    }
};
