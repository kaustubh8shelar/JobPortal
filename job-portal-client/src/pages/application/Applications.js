import { useEffect, useState } from "react";
import { getApplications } from "../../api/application";
import { getJobById } from "../../api/job";
import { getCurrentUser } from "../../api/user";
import { getCompanyById } from "../../api/company";
import { 
  Container, Card, CardContent, Typography, Grid, Box, Chip, Divider, Stepper, Step, StepLabel, List, ListItem, ListItemText, Skeleton 
} from "@mui/material";
import Navbar from "../../components/Navbar";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState({});
  const [companyDetails, setCompanyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

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
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {loading ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>Your Applications</Typography>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height={50} variant="rectangular" sx={{ marginBottom: 1, borderRadius: 1 }} />
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} width="60%" />
                  <Skeleton variant="rectangular" height={30} width="30%" sx={{ marginTop: 1, marginBottom: 2 }} />
                  <Skeleton variant="text" height={30} width="40%" />
                  <Skeleton variant="text" height={30} width="50%" />
                  <Skeleton variant="text" height={30} width="45%" />
                  <Divider sx={{ marginY: 2 }} />
                  <Skeleton variant="rectangular" height={30} width="90%" sx={{ marginTop: 1, marginBottom: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>Your Applications</Typography>
                  <List>
                    {applications.length > 0 ? (
                      applications.map((application) => (
                        <ListItem 
                          button 
                          key={application.id} 
                          onClick={async () => {
                            setSelectedLoading(true);
                            setSelectedApplication(application);
                            // Optional delay for visual effect
                            setTimeout(() => setSelectedLoading(false), 500);
                          }}                          
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

            <Grid item xs={12} md={8}>
              {selectedApplication ? (
                 selectedLoading ? (
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" height={40} width="60%" />
                      <Skeleton variant="rectangular" height={30} width="30%" sx={{ marginY: 2 }} />
                      <Skeleton variant="text" height={30} width="50%" />
                      <Skeleton variant="text" height={30} width="40%" />
                      <Skeleton variant="text" height={30} width="45%" />
                      <Divider sx={{ marginY: 2 }} />
                      <Skeleton variant="rectangular" height={30} width="90%" sx={{ marginY: 1 }} />
                    </CardContent>
                  </Card>
                ): (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                      {jobDetails[selectedApplication.jobId]?.title || "Loading..."}
                    </Typography>
                    <Chip 
                      label={selectedApplication.status} 
                      color={
                        selectedApplication.status === "Hired" ? "success" :
                        selectedApplication.status === "Rejected" ? "error" : "warning"
                      } 
                      sx={{ marginBottom: 2 }} 
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Salary: ₹{jobDetails[selectedApplication.jobId]?.salary || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Company: {companyDetails[jobDetails[selectedApplication.jobId]?.companyId] || "Loading..."}
                    </Typography>
                    <Typography variant="body2">
                      Location: {jobDetails[selectedApplication.jobId]?.location || "N/A"}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                      Application Status
                    </Typography>

                    {selectedApplication.status === "Rejected" ? (
                      <Stepper activeStep={0} alternativeLabel>
                        <Step>
                          <StepLabel error>Application Rejected</StepLabel>
                        </Step>
                      </Stepper>
                    ) : (
                      <Stepper
                        activeStep={
                          ["Applied", "Application Sent", "Awaiting Recruiter Action", "Interview", "Hired"].indexOf(selectedApplication.status)
                        }
                        alternativeLabel
                      >
                        {["Applied", "Application Sent", "Awaiting Recruiter Action", "Interview", "Hired"].map((label, index) => (
                          <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    )}
                  </CardContent>
                </Card>
              )) : (
                <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3 }}>
                  Select an application to view details
                </Typography>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Applications;
