import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Box, Chip, MenuItem,
  Snackbar, Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/user";
import { createJob } from "../../api/job";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const experienceRanges = ["0 - 1", "1 - 3", "3 - 5", "5 - 10"];
const salaryRanges = ["200,000 - 400,000", "400,000 - 700,000", "700,000 - 1,000,000", "1,000,000+"];

const CreateJobPost = ({ open, handleClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: "", description: "", location: "",
    skillsRequired: [], skillInput: "",
    requiredExperience: "", requiredEducation: "", salary: "",
  });
  const [companyId, setCompanyId] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // Reset form when the dialog opens
      setFormData({
        title: "",
        description: "",
        location: "",
        skillsRequired: [],
        skillInput: "",
        requiredExperience: "",
        requiredEducation: "",
        salary: "",
      });
      setSnackbar({ open: false, message: "", severity: "info" });
    }
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user?.companyId) setCompanyId(user.companyId);
        else setSnackbar({ open: true, message: "Company ID not found", severity: "error" });
      } catch (err) {
        console.error("User error", err);
        setSnackbar({ open: true, message: "Failed to fetch user", severity: "error" });
      }
    };
    if (open) fetchUser(); // fetch only when modal opens
  }, [open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && formData.skillInput.trim()) {
      e.preventDefault();
      if (!formData.skillsRequired.includes(formData.skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skillsRequired: [...prev.skillsRequired, prev.skillInput.trim()],
          skillInput: "",
        }));
      }
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skillInput: undefined,
      companyId,
      postedAt: new Date().toISOString(),
    };
    try {
      await createJob(payload);
      setSnackbar({ open: true, message: "Job created successfully!", severity: "success" });
      setTimeout(() => {
        onJobCreated();    // trigger the dashboard to refresh
        handleClose();     // close the dialog
      }, 1000);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to create job", severity: "error" });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          // Prevent closing on backdrop click or escape key
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Create a New Job Post
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField label="Job Title" name="title" fullWidth margin="normal" required value={formData.title} onChange={handleChange} />
            <TextField label="Description" name="description" fullWidth multiline rows={4} margin="normal" required value={formData.description} onChange={handleChange} />
            <TextField label="Location" name="location" fullWidth margin="normal" required value={formData.location} onChange={handleChange} />

            <TextField
              label="Add Skills (Enter or comma)"
              fullWidth
              margin="normal"
              value={formData.skillInput}
              onChange={(e) => setFormData((prev) => ({ ...prev, skillInput: e.target.value }))}
              onKeyDown={handleSkillKeyDown}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {formData.skillsRequired.map((skill) => (
                <Chip key={skill} label={skill} onDelete={() => handleSkillDelete(skill)} />
              ))}
            </Box>

            <TextField
              select label="Experience" name="requiredExperience"
              fullWidth margin="normal" required value={formData.requiredExperience}
              onChange={handleChange}
            >
              {experienceRanges.map((range) => (
                <MenuItem key={range} value={range}>{range}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Required Education"
              name="requiredEducation"
              fullWidth
              margin="normal"
              required
              value={formData.requiredEducation}
              onChange={handleChange}
            />

            <TextField
              select label="Salary Range" name="salary"
              fullWidth margin="normal" required value={formData.salary}
              onChange={handleChange}
            >
              {salaryRanges.map((range) => (
                <MenuItem key={range} value={range}>{range}</MenuItem>
              ))}
            </TextField>
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">Create</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default CreateJobPost;
