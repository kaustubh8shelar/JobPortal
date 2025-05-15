import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Paper,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Skeleton
} from '@mui/material';
import { registerUser } from '../api/auth';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Job Seeker',
    experience: '',
    education: '',
    skills: [],
    company: '',
  });

  const [skillOptions, setSkillOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [companyInput, setCompanyInput] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'role' && value === 'Job Seeker' ? { company: '' } : {}),
    }));
  };

  const handleSkillsChange = (_, value) => {
    setFormData((prev) => ({ ...prev, skills: value }));
  };

  const handleCompanyChange = (_, value) => {
    setFormData((prev) => ({ ...prev, company: value || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    try {
      const response = await registerUser(formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess('Registration successful. Redirecting to login...');
        setFormData({
          fullName: '',
          email: '',
          password: '',
          role: 'Job Seeker',
          experience: '',
          education: '',
          skills: [],
          company: '',
        });
  
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!skillInput.trim()) {
      setSkillOptions([]);
      return;
    }
  
    const delayDebounce = setTimeout(async () => {
      setLoadingSkills(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/jobs/skills?query=${skillInput}`);
        setSkillOptions(response.data);
      } catch (err) {
        console.error('Error fetching skills', err);
      } finally {
        setLoadingSkills(false);
      }
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [skillInput]);

  useEffect(() => {
    if (!companyInput.trim()) {
      setCompanyOptions([]);
      return;
    }
  
    const delayDebounce = setTimeout(async () => {
      setLoadingCompanies(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/companies/companyNames?query=${companyInput}`);
        setCompanyOptions(response.data || []);
      } catch (err) {
        console.error('Error fetching companies', err);
      } finally {
        setLoadingCompanies(false);
      }
    }, 500); 
  
    return () => clearTimeout(delayDebounce);
  }, [companyInput]);

  
  return (
    <Container maxWidth="sm">
    {loading ? (
      <>
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={50} sx={{ mb: 2 }} />
        <Typography align="center">Please wait, registering your account...</Typography>
      </>
    ) : (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Create Your Account
          </Typography>

          <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
            Start your journey with us
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              value={formData.fullName}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              select
              label="Role"
              name="role"
              fullWidth
              value={formData.role}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            >
              <MenuItem value="Job Seeker">Job Seeker</MenuItem>
              <MenuItem value="Employer">Employer</MenuItem>
            </TextField>
            <TextField
              label="Experience (in years)"
              name="experience"
              type="number"
              fullWidth
              value={formData.experience}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <TextField
              label="Education"
              name="education"
              fullWidth
              value={formData.education}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <Autocomplete
              multiple
              options={skillOptions}
              value={formData.skills}
              onInputChange={(e, value) => setSkillInput(value)}
              onChange={handleSkillsChange}
              freeSolo
              loading={loadingSkills}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Type to search skills"
                  sx={{ mb: 3 }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingSkills ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <Autocomplete
              freeSolo
              disabled={formData.role !== 'Employer'}
              options={companyOptions}
              getOptionLabel={(option) => option}
              value={formData.company}
              inputValue={companyInput}
              onInputChange={(e, value) => setCompanyInput(value)}
              onChange={handleCompanyChange}
              filterOptions={(x) => x}
              loading={loadingCompanies}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="Company Name"
                  placeholder="Start typing to search"
                  sx={{ mb: 4 }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingCompanies ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />  

            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                sx={{ mt: 2 }}
            >
              Register
            </Button>
            <Box sx={{ mt: 2 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already registered?{' '}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
                >
                  Login here
                </Button>
              </Typography>
            </Box>

          </form>
        
          <Snackbar
            open={openSnackbar}
            autoHideDuration={2500}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>

        </Paper>
    </Box>
    )}
    </Container>
  );
};


export default Register;
