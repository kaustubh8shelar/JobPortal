import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Card, CardContent, Typography, Stack, Chip, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Skeleton, Box, Button, Snackbar, Alert, Avatar
} from "@mui/material";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";
import { getCompanyById } from "../../api/company";
import { getJobById } from "../../api/job";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { deleteJob } from "../../api/admin";

const EmployerJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

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
      console.log("Delete Res: ", res);
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

              <Button
                variant="contained"
                color="error"
                sx={{ mt: 3 }}
                onClick={() => setOpenDialog(true)}
              >
                Delete Job Post
              </Button>
            </CardContent>
          </Box>
        </Card>

        <Card sx={GlobalStyles.card}>
          <CardContent>
            <Typography variant="h6" sx={GlobalStyles.title}>Job Description</Typography>
            <Typography variant="body1" sx={GlobalStyles.jobDescription}>
              {job.description}
            </Typography>
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
    </div>
  );
};

export default EmployerJobDetails;
