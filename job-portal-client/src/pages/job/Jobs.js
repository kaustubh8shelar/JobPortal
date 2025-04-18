import { useEffect, useState } from "react";
import { getRecommendedJobs } from "../../api/job";
import { getCurrentUser } from "../../api/user";
import {
  Container, Card, CardContent, Typography,
  Pagination, Box, Grid, Avatar, Skeleton
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";
import { getCompanyById } from "../../api/company"; 

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState({});
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userRes = await getCurrentUser();
        const userId = userRes?.id;
        if (userId) {
          const jobRes = await getRecommendedJobs(userId);
          await fetchCompanyNames(jobRes.data);
          setJobs(jobRes.data || []);
        }
      } catch (error) {
        console.error("Error fetching recommended jobs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const fetchCompanyNames = async (jobsList) => {
    const companyData = {};
  
    for (const job of jobsList) {
      if (job.companyId && !companyDetails[job.companyId]) {
        try {
          const response = await getCompanyById(job.companyId);
          companyData[job.companyId] = {
            name: response.data.name,
            logoUrl: response.data.logoUrl,
          };
        } catch (error) {
          console.error("Error fetching company:", error);
        }
      }
    }
    setCompanyDetails((prev) => ({ ...prev, ...companyData }));
  };

  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h5" sx={GlobalStyles.pageTitle}>
            Recommended Jobs
          </Typography>
          <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} key={index}>
              <Card sx={{ display: "flex", p: 2, mb: 2, borderRadius: 5, alignItems: "center",height: "80%"}}>
                <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="90%" height={18} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="50%" height={18} sx={{ mt: 1 }} />
                </Box>
              </Card>
            </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h5" sx={GlobalStyles.pageTitle}>
          Recommended Jobs
        </Typography>

        <Grid container spacing={2}>
          {currentJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
                      <Box sx={{ display: "flex", alignItems: "center"}}>
                      <Typography variant="body2" sx={GlobalStyles.company}>
                        {companyDetails[job.companyId]?.name || "Loading company..."}
                      </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5  }}>
                          <WorkOutlineIcon fontSize="small" sx={{ color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">{job.requiredExperience} Yrs</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">{job.location}</Typography>
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
              </Link>
            </Grid>
          ))}
        </Grid>

        <Box sx={GlobalStyles.paginationBox}>
          <Pagination
            count={Math.ceil(jobs.length / jobsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            variant="outlined"
            color="primary"
            size="large"
          />
        </Box>
      </Container>
    </div>
  );
};

export default Jobs;
