import { useEffect, useState } from "react";
import { getApplications } from "../../api/application";
import { getJobById } from "../../api/job";
import { getCurrentUser } from "../../api/user";
import { getCompanyById } from "../../api/company";
import { 
  Container, Card, CardContent, Typography, Grid, CircularProgress, Box, Chip, Divider, Stepper, Step, StepLabel, List, ListItem, ListItemText 
} from "@mui/material";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState({});
  const [companyDetails, setCompanyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

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
        const companyData = {};
        
        for (const application of response.data) {
          const jobResponse = await getJobById(application.jobId);
          const job = jobResponse.data;
          jobData[application.jobId] = job;

          if (job.companyId && !companyData[job.companyId]) {
            const companyResponse = await getCompanyById(job.companyId);
            companyData[job.companyId] = companyResponse.data.name;
          }
        }

        setJobDetails(jobData);
        setCompanyDetails(companyData);
      } catch (error) {
        console.error("Error fetching applications, jobs, or companies", error);
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
        <Typography variant="h5" sx={GlobalStyles.pageTitle}>Applications</Typography>

        {loading ? (
          <Box sx={GlobalStyles.loadingBox}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Left Side - List of Applications */}
            <Grid item xs={12} md={4}>
              <Card sx={GlobalStyles.applicationListCard}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>Your Applications</Typography>
                  <List>
                    {applications.length > 0 ? (
                      applications.map((application) => (
                        <ListItem 
                          button 
                          key={application.id} 
                          onClick={() => setSelectedApplication(application)}
                          sx={{ 
                            backgroundColor: selectedApplication?.id === application.id ? "#e3f2fd" : "transparent", 
                            borderRadius: 1, 
                            marginBottom: 1 
                          }}
                        >
                          <ListItemText 
                            primary={jobDetails[application.jobId]?.title || "Loading..."} 
                            secondary={`Status: ${application.status}`}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2">No applications found</Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Side - Details of Selected Application */}
            <Grid item xs={12} md={8}>
              {selectedApplication ? (
                <Card sx={GlobalStyles.applicationDetailsCard}>
                  <CardContent>
                    <Typography variant="h6" sx={GlobalStyles.jobTitle}>
                      {jobDetails[selectedApplication.jobId]?.title || "Loading..."}
                    </Typography>
                    <Chip 
                      label={selectedApplication.status} 
                      color={selectedApplication.status === "Hired" ? "success" : selectedApplication.status === "Rejected" ? "error" : "warning"} 
                      sx={GlobalStyles.statusChip} 
                    />
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold" }}>
                      Salary: ₹{jobDetails[selectedApplication.jobId]?.salary || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={GlobalStyles.jobDetails}>
                      Company: {companyDetails[jobDetails[selectedApplication.jobId]?.companyId] || "Loading..."}
                    </Typography>
                    <Typography variant="body2" sx={GlobalStyles.jobDetails}>
                      Location: {jobDetails[selectedApplication.jobId]?.location || "N/A"}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />

                    {/* Timeline Stepper */}
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                      Application Status
                    </Typography>
                    <Stepper activeStep={["Applied", "Application Sent", "Awaiting Recruiter Action", "Interview", "Hired", "Rejected"].indexOf(selectedApplication.status)} alternativeLabel>
                      {["Applied", "Application Sent", "Awaiting Recruiter Action", "Interview", "Hired", "Rejected"].map((label, index) => (
                        <Step key={index}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </CardContent>
                </Card>
              ) : (
                <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3 }}>Select an application to view details</Typography>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Applications;
