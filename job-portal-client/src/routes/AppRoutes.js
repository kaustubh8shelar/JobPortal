import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
// import Register from "../pages/Register";
import Jobs from "../pages/job/Jobs";
import PrivateRoute from "./PrivateRoute";
import Logout from "../pages/Logout";
import Applications from "../pages/application/Applications";
import SearchJobs from "../pages/job/SearchJobs";
import Profile from "../pages/user/Profile";
import JobDetails from "../pages/job/JobDetails";
import UseAuthCheck from "../api/useAuthCheck";
import DelayedRoute from "./DelayedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <UseAuthCheck />
      <Routes>
      {/* <Route element={<DelayedRoute delay={500} />}> */}
        <Route path="/" element={<PrivateRoute><Jobs /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
        <Route path="/jobs/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
        <Route path="/search-jobs" element={<PrivateRoute><SearchJobs /></PrivateRoute>} />
        <Route path="/logout" element={<Logout />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
