import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!token) {
      if (isLoggedIn) {
        alert("Session Expired. Login again.");
      }
      setShouldRedirect(true);
    }
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
