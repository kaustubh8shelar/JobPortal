import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Skeleton,
  Button,
  Pagination,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useNavigate } from "react-router-dom";
import { getEmployerJobs } from "../../api/job";
import { getCompanyById } from "../../api/company";
import { getCurrentUser } from "../../api/user";
import GlobalStyles from "../../styles/GlobalStyles";
import Navbar from "../../components/Navbar";
import CreateJobPost from "../job/CreateJobPost";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [companyDetails, setCompanyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const jobsPerPage = 5;
  const navigate = useNavigate();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const user = await getCurrentUser();
        if (user && user.companyId) {
          const email = user.email;
          const res = await getEmployerJobs(email);
          const jobList = res.data;

          // Filter jobs posted by the employer's company
          const filteredJobs = jobList.filter(job => job.companyId === user.companyId);

          await fetchCompanyNames(filteredJobs);
          setJobs(filteredJobs);
        } else {
          console.error("User or Company ID not found!");
        }
      } else {
        console.error("Token not available!");
      }
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

    const fetchCompanyNames = async (jobList) => {
      const companyMap = {};
      for (const job of jobList) {
        if (job.companyId && !companyDetails[job.companyId]) {
          try {
            const response = await getCompanyById(job.companyId);
            companyMap[job.companyId] = {
              name: response.data.name,
              logoUrl: response.data.logoUrl,
            };
          } catch (err) {
            console.error("Company fetch error", err);
          }
        }
      }
      setCompanyDetails((prev) => ({ ...prev, ...companyMap }));
    };

    fetchJobs();
  }, []);

  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Navbar />
      <Box p={3} maxWidth="md" mx="auto">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography sx={GlobalStyles.title} variant="h4">My Job Posts</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenCreateDialog(true)}
          >
            Create Job Post
          </Button>
        </Box>
        <CreateJobPost open={openCreateDialog} handleClose={() => setOpenCreateDialog(false)} />
        <Grid container spacing={2}>
          {loading
            ? [...Array(5)].map((_, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ display: "flex", p: 2, mb: 2, borderRadius: 5, alignItems: "center" }}>
                    <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={28} />
                      <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
                      <Skeleton variant="text" width="90%" height={18} sx={{ mt: 1 }} />
                      <Skeleton variant="text" width="50%" height={18} sx={{ mt: 1 }} />
                    </Box>
                  </Card>
                </Grid>
              ))
            : currentJobs.length === 0
            ? (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ p: 3, borderRadius: 5, textAlign: "center" }}
                >
                  You haven't posted any jobs yet.
                </Typography>
              </Grid>
            )
            : (
              currentJobs.map((job) => (
                <Grid item xs={12} key={job.id}>
                  <a
                    href={`/employer/jobs/${job.id}`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card sx={GlobalStyles.jobCard}>
                      <Avatar
                        src={companyDetails[job.companyId]?.logoUrl || ""}
                        alt={companyDetails[job.companyId]?.name || ""}
                        sx={GlobalStyles.jobAvatar}
                      >
                        {companyDetails[job.companyId]?.name?.charAt(0) || job.title.charAt(0)}
                      </Avatar>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={GlobalStyles.jobTitle}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" sx={GlobalStyles.company}>
                          {companyDetails[job.companyId]?.name || "Loading company..."}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mt: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <WorkOutlineIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.requiredExperience} Yrs
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CurrencyRupeeIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.salary}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                          {job.skillsRequired.join(" • ")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </a>
                </Grid>
              ))
            )}
        </Grid>

        {/* Pagination */}
        {!loading && jobs.length > jobsPerPage && (
          <Box sx={GlobalStyles.paginationBox}>
            <Pagination
              count={Math.ceil(jobs.length / jobsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              variant="outlined"
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default EmployerDashboard;
