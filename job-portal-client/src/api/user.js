import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8080/api/users";

export const getUserByEmail = async (email) => {
    const url = `/email/${encodeURIComponent(email)}`;
    return await axios.get(`${API_URL}`+ url);
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        // console.log("UserID : ", userId);
        const response = await axios.get(`${API_URL}/email/${userId}`);
        // console.log("response : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching user", error);
        return null;
    }
};
