import { useEffect, useState } from "react";
import {
  Container, Card, CardContent, Typography, Pagination, Box,
  Grid, Avatar, Skeleton, Tabs, Tab
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";
import { getCompanyById } from "../../api/company";
import { getCurrentUser } from "../../api/user";
import { getJobs, getRecommendedJobs } from "../../api/job";
import { getApplications } from "../../api/application";

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [companyDetails, setCompanyDetails] = useState({});
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        const userId = userRes?.id;
        const userEmail = userRes?.email;

        if (userId && userEmail) {
          const [jobsRes, recommendedRes, appsRes] = await Promise.all([
            getJobs(),
            getRecommendedJobs(userId),
            getApplications(userEmail)
          ]);

          const appliedIds = new Set(appsRes.data.map((app) => app.jobId));
          setAppliedJobIds(appliedIds);

          await fetchCompanyNames([...jobsRes.data, ...recommendedRes.data]);

          setAllJobs(jobsRes.data || []);
          setRecommendedJobs(recommendedRes.data || []);
        }
      } catch (error) {
        console.error("Error fetching jobs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const displayedJobs = tabIndex === 0 ? allJobs : recommendedJobs;
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = displayedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(1); // Reset page on tab switch
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="md">
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Explore" />
            <Tab label="Recommended" />
          </Tabs>
          <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
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

        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2, mt: 2 }}>
          <Tab label="Explore" />
          <Tab label="Recommended" />
        </Tabs>

        <Grid container spacing={2}>
        {currentJobs.length === 0 ? (
          <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" sx={{ p: 3, borderRadius: 5, textAlign: "center" }}>
                  {tabIndex === 1 ? "No recommended jobs found." : "No jobs available."}
                </Typography>
            </Grid>
          ) : (currentJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <a
                href={`/jobs/${job.id}`}
                target="_blank"
                rel="noopener noreferrer"
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={GlobalStyles.jobTitle}>
                        {job.title}
                      </Typography>
                      {appliedJobIds.has(job.id) && (
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.5,
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                            fontWeight: 500,
                            color: "text.secondary",
                          }}
                        >
                          Already Applied
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" sx={GlobalStyles.company}>
                        {companyDetails[job.companyId]?.name || "Loading company..."}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
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
          )
          ))}
        </Grid>
        <Box sx={GlobalStyles.paginationBox}>
          <Pagination
            count={Math.ceil(displayedJobs.length / jobsPerPage)}
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
