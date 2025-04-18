import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../api/job";
import { getApplications, applyForJob } from "../../api/application";
import { getCurrentUser } from "../../api/user";
import { Container, Card, CardContent, Typography, Button, Stack, 
  Chip, Divider, Snackbar, Alert, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Skeleton, Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";
import { getCompanyById } from "../../api/company";
import { Avatar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(id);
        setTimeout(async () => {
          const jobData = response.data;
          setJob(jobData);
    
          if (jobData.companyId) {
            try {
              const companyRes = await getCompanyById(jobData.companyId);
              setCompany(companyRes.data);
            } catch (err) {
              console.error("Error fetching company info", err);
            }
          }
        }, 800);
      } catch (error) {
        console.error("Error fetching job details", error);
      }
    };    

    const fetchUserDetails = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response);
        const appResponse = await getApplications(response.email);

        if (Array.isArray(appResponse.data) && appResponse.data.length > 0) {
          appResponse.data.forEach((application, index) => {
            if (application.jobId === id) {
              // console.log(`Job ID at index ${index}: `, application.jobId);
              setApplication(appResponse.data);
            } else {
              // console.log("Do nothing");
            }
          });
        } else {
          // console.log("No applications found or appResponse.data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching user or application details", error);
      }
    };

    fetchJobDetails();
    fetchUserDetails();
  }, [id]);

  const handleApply = async () => {
    setOpenDialog(true);
  };

  const confirmApply = async () => {
    setOpenDialog(false);
    if (!user) {
      setSnackbarMessage("You need to log in to apply for jobs.");
      setOpenSnackbar(true);
      return;
    }

    if (application) {
      setSnackbarMessage("You have already applied for this job.");
      setOpenSnackbar(true);
      return;
    }

    const applicationData = {
      jobId: id,
      experience: user.experience || "",
      education: user.education || "",
      status: "Applied"
    };

    try {
      await applyForJob(applicationData);
      setSnackbarMessage("Application submitted successfully!");
      setApplication(applicationData);
    } catch (error) {
      console.error("Error applying for job", error);
      setSnackbarMessage("Failed to apply. Please try again later.");
    }
    setOpenSnackbar(true);
  };

  if (!job) {
    return (
      <div>
      <Navbar />
      <Container maxWidth="md" sx={GlobalStyles.container}>
        <Card sx={GlobalStyles.card}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mt: 1 }} />
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="50%" height={24} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" height={24} sx={{ mt: 1 }} />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} variant="rounded" width={80} height={32} />
              ))}
            </Stack>
            <Skeleton variant="rectangular" width="150px" height={40} sx={{ mt: 3 }} />
          </CardContent>
        </Card>

        <Card sx={GlobalStyles.card}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={150} />
          </Box>
        </Card>
      </Container>
    </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={GlobalStyles.container}>
        <Card sx={GlobalStyles.card}>
        <Box sx={{ position: "relative" }}>
          {company?.logoUrl && (
            <Avatar
              src={company.logoUrl}
              alt={company.name}
              sx={{
                width: 60,
                height: 60,
                position: "absolute",
                top: 16,
                right: 16,
                // boxShadow: 3,
                border: "2px solid white",
                bgcolor: "white"
              }}
            />
          )}
          <CardContent>
              <Typography variant="h4" sx={GlobalStyles.title}>{job.title}</Typography>
              <Typography variant="body1" sx={GlobalStyles.company}>{company?.name || job.company}</Typography>
            <Divider sx={GlobalStyles.divider} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5  }}>
                  <WorkOutlineIcon fontSize="small" sx={{ color: "#000" }}  />
                  <Typography variant="body2" sx={{ color: "#000" }}>{job.requiredExperience} Yrs</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: "#000" }}  />
                  <Typography variant="body2" sx={{ color: "#000" }} >{job.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CurrencyRupeeIcon fontSize="small" sx={{ color: "#000" }}  />
                  <Typography variant="body2" sx={{ color: "#000" }} >
                    {job.salary}
                  </Typography>
                </Box>
            </Box>
            <Stack direction="row" spacing={1} sx={GlobalStyles.skillsStack}>
              {job.skillsRequired.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" variant="outlined" />
              ))}
            </Stack>
            <Button variant="contained" color="primary" sx={GlobalStyles.applyButton} onClick={handleApply} disabled={!!application}>
              {application ? "Already Applied" : "Apply Now"}
            </Button>
          </CardContent>
          </Box>
        </Card>
        <Card sx={GlobalStyles.card}>
          <CardContent>
            <Typography variant="h6" sx={GlobalStyles.title}>Job Description</Typography>
            <Typography variant="body1" sx={GlobalStyles.jobDescription}>{job.description}</Typography>
          </CardContent>
        </Card>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="info" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Application</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to apply for this job?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={confirmApply} color="primary" autoFocus>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobDetails;