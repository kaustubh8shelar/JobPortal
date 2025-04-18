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