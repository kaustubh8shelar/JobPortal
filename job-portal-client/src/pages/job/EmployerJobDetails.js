import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Card, CardContent, Typography, Stack, Chip, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Skeleton, Box, Button, Snackbar, Alert, Avatar, Stepper, Step, StepLabel
} from "@mui/material";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";
import { getCompanyById } from "../../api/company";
import { getJobById } from "../../api/job";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { deleteJob } from "../../api/admin";
import { getApplicationsByJobId, updateApplicationStatus } from "../../api/application";

const EmployerJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [applications, setApplications] = useState([]);
  const [showApplicationsDialog, setShowApplicationsDialog] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({ open: false, applicationId: null, newStatus: "" });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(id);
        const jobData = response.data;
        setTimeout(async () => {
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

    fetchJobDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await deleteJob(id);
      setSnackbar({ open: true, message: "Job deleted successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/employer/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error deleting job:", error);
      setSnackbar({ open: true, message: "Failed to delete job.", severity: "error" });
    }
    setOpenDialog(false);
  };

  const fetchApplications = async () => {
    try {
      const response = await getApplicationsByJobId(id);
      setApplications(response.data);
      setShowApplicationsDialog(true);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const confirmStatusUpdate = (applicationId, newStatus) => {
    setConfirmationDialog({ open: true, applicationId, newStatus });
  };

  const handleStatusUpdateConfirmed = async () => {
    const { applicationId, newStatus } = confirmationDialog;
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app)
      );
      setSnackbar({ open: true, message: `Status updated to ${newStatus}`, severity: "success" });
    } catch (err) {
      console.error("Failed to update status:", err);
      setSnackbar({ open: true, message: "Failed to update status", severity: "error" });
    }
    setConfirmationDialog({ open: false, applicationId: null, newStatus: "" });
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
                  border: "2px solid white",
                  bgcolor: "white"
                }}
              />
            )}
            <CardContent>
              <Typography variant="h4" sx={GlobalStyles.title}>{job.title}</Typography>
              <Typography variant="body1" sx={GlobalStyles.company}>
                {company?.name || job.company}
              </Typography>
              <Divider sx={GlobalStyles.divider} />

              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <WorkOutlineIcon fontSize="small" sx={{ color: "#000" }} />
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    {job.requiredExperience} Yrs
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: "#000" }} />
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    {job.location}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CurrencyRupeeIcon fontSize="small" sx={{ color: "#000" }} />
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    {job.salary}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1} sx={GlobalStyles.skillsStack}>
                {job.skillsRequired.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" variant="outlined" />
                ))}
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mt: 3 }}>
                <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
                  Delete Job Post
                </Button>
                <Button variant="contained" color="primary" onClick={fetchApplications}>
                  View Applications
                </Button>
              </Box>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job posting? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Applications Dialog */}
      <Dialog open={showApplicationsDialog} onClose={() => setShowApplicationsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Applications for this Job</DialogTitle>
        <DialogContent dividers>
          {applications.length === 0 ? (
            <Typography>No applications found.</Typography>
          ) : (
            applications.map((app, index) => {
              const stepIndex = ["Applied", "Application Sent", "Awaiting Recruiter Action", "Interview", "Hired"].indexOf(app.status);
              return (
                <Card key={index} sx={{ mb: 2, p: 2 }}>
                  <Typography><strong>User:</strong> {app.userId}</Typography>
                  <Typography><strong>Experience:</strong> {app.experience} years</Typography>
                  <Typography><strong>Education:</strong> {app.education}</Typography>

                  <Stepper activeStep={stepIndex >= 0 ? stepIndex : 0} alternativeLabel sx={{ mt: 2 }}>
                    {["Applied", "Application Sent", "Awaiting Recruiter Action", "Interview", "Hired"].map((label) => (
                      <Step key={label}>
                        <StepLabel
                          onClick={() => confirmStatusUpdate(app.id, label)}
                          sx={{ cursor: "pointer" }}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Card>
              );
            })
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApplicationsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Status Change */}
      <Dialog open={confirmationDialog.open} onClose={() => setConfirmationDialog({ ...confirmationDialog, open: false })}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status to <strong>{confirmationDialog.newStatus}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialog({ ...confirmationDialog, open: false })}>Cancel</Button>
          <Button onClick={handleStatusUpdateConfirmed} color="primary" variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployerJobDetails;
