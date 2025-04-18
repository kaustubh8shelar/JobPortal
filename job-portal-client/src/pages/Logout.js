import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session and redirect to login page
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  }, [navigate]);
};

export default Logout;
