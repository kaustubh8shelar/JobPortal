import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/admin`; 

export const deleteJob = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.delete(`${API_BASE_URL}/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log("REs : ", res.data);
        return res.data;
    } catch (error) {
        console.error("Error deleting job:", error.response?.data || error.message);
        throw error;
    }
};
