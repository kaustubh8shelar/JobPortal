import { useEffect, useState } from "react";
import { getApplications } from "../../api/application";
import { getJobById } from "../../api/job";
import { getCurrentUser } from "../../api/user";
import { Container, Card, CardContent, Typography, Grid, CircularProgress, Box, Chip } from "@mui/material";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles"; // Import styles

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          console.error("User not found");
          setLoading(false);
          return;
        }
        
        const response = await getApplications(user.email);
        setApplications(response.data);

        const jobData = {};
        for (const application of response.data) {
          const jobResponse = await getJobById(application.jobId);
          jobData[application.jobId] = jobResponse.data;
        }

        setJobDetails(jobData);
      } catch (error) {
        console.error("Error fetching applications or jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h5" sx={GlobalStyles.applicationsTitle}>
          My Applications
        </Typography>
        {loading ? (
          <Box sx={GlobalStyles.loadingBox}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {applications.length > 0 ? (
              applications.map((application) => {
                const job = jobDetails[application.jobId];
                return (
                  <Grid item xs={12} sm={6} md={4} key={application.id}>
                    <Card sx={GlobalStyles.applicationCard}>
                      <CardContent>
                        <Typography variant="h6" sx={GlobalStyles.jobTitle}>
                          {job?.title || "Loading..."}
                        </Typography>
                        <Chip 
                          label={application.status} 
                          color={application.status === "completed" ? "success" : application.status === "Rejected" ? "error" : "warning"} 
                          sx={GlobalStyles.statusChip} 
                        />
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold" }}>
                          Salary: ₹{job?.salary || "N/A"}
                        </Typography>
                        <Typography variant="body2" sx={GlobalStyles.jobDetails}>
                          Company: {job?.company || "N/A"}
                        </Typography>
                        <Typography variant="body2" sx={GlobalStyles.jobDetails}>
                          Location: {job?.location || "N/A"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Typography variant="h6" sx={GlobalStyles.noApplicationsText}>
                No applications found
              </Typography>
            )}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Applications;
