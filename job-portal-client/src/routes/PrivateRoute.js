import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsSessionExpired(true);
    }
  }, []);

  if (isSessionExpired) {
    alert("Session Expired. Login again.");
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
