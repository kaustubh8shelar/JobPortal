import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/users`;

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  const { email, password } = credentials;
  const url = `/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  // console.log("API base:", process.env.REACT_APP_API_BASE_URL);
  // console.log("URL: " + API_URL + " " + url);
  return await axios.post(`${API_URL}`+ url);
};
