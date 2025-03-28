import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/companies";

export const getCompanyById = async (companyId) => {
    return await axios.get(`${API_BASE_URL}/${companyId}`);
};
