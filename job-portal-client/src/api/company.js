import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/companies`;

export const getCompanyById = async (companyId) => {
    return await axios.get(`${API_BASE_URL}/${companyId}`);
};
