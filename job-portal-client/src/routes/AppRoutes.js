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
import Register from "../pages/Register";
import EmployerDashboard from "../pages/user/EmployerDashboard";
import EmployerJobDetails from "../pages/job/EmployerJobDetails";
import { Navigate } from "react-router-dom";
import CreateJobPost from "../pages/job/CreateJobPost";

const AppRoutes = () => {
  return (
    <Router>
      <UseAuthCheck />
      <Routes>
      {/* <Route element={<DelayedRoute delay={500} />}> */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                localStorage.getItem("role") === "employer"
                  ? "/employer/dashboard"
                  : "/jobs"
              }
              replace
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
        <Route path="/employer/dashboard" element={<PrivateRoute><EmployerDashboard/></PrivateRoute>} />
        <Route path="/jobs/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
        <Route path="/employer/jobs/:id" element={<PrivateRoute><EmployerJobDetails /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
        <Route path="/search-jobs" element={<PrivateRoute><SearchJobs /></PrivateRoute>} />
        <Route path="/employer/create-job" element={<PrivateRoute><CreateJobPost /></PrivateRoute>} />
        <Route path="/logout" element={<Logout />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
