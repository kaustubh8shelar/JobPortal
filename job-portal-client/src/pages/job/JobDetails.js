import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../api/job";
import { getApplications, applyForJob } from "../../api/application";
import { getCurrentUser } from "../../api/user";
import { Container, Card, CardContent, Typography, Button, Stack, Chip, Divider, Snackbar, Alert } from "@mui/material";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(id);
        setJob(response.data);
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
              console.log(`Job ID at index ${index}: `, application.jobId);
              setApplication(appResponse.data);
            } else {
              console.log("Do nothing");
            }
          });
        } else {
          console.log("No applications found or appResponse.data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching user or application details", error);
      }
    };

    fetchJobDetails();
    fetchUserDetails();
  }, [id]);

  const handleApply = async () => {
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
      status: "Pending"
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
    return <Typography sx={{ textAlign: "center", mt: 4 }}>Loading...</Typography>;
  }

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={GlobalStyles.container}>
        <Card sx={GlobalStyles.card}>
          <CardContent>
            <Typography variant="h4" sx={GlobalStyles.title}>{job.title}</Typography>
            <Typography variant="h6" sx={GlobalStyles.company}>{job.company}</Typography>
            <Divider sx={GlobalStyles.divider} />
            <Typography variant="subtitle1" sx={GlobalStyles.experience}>{job.requiredExperience} Years</Typography>
            <Typography variant="subtitle1" sx={GlobalStyles.salary}>Salary: ₹{job.salary}</Typography>
            <Typography variant="body1" sx={GlobalStyles.location}>{job.location}</Typography>
            <Stack direction="row" spacing={1} sx={GlobalStyles.skillsStack}>
              {job.skillsRequired.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" variant="outlined" />
              ))}
            </Stack>
            <Button variant="contained" color="primary" sx={GlobalStyles.applyButton} onClick={handleApply} disabled={!!application}>
              {application ? "Already Applied" : "Apply Now"}
            </Button>
          </CardContent>
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
    </div>
  );
};

export default JobDetails;
