import React, { useState } from 'react';
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
} from '@mui/material';
import { registerUser } from '../api/auth';
import axios from 'axios';
import debounce from 'lodash.debounce';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    try {
      const response = await registerUser(formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess('Registration successful. You can now log in.');
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
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const fetchSkills = debounce(async (query) => {
    if (!query) return;
    setLoadingSkills(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/jobs/skills?query=${query}`);
      setSkillOptions(response.data || []);
    } catch (err) {
      console.error('Error fetching skills', err);
    } finally {
      setLoadingSkills(false);
    }
  }, 500);

  const fetchCompanies = debounce(async (query) => {
    if (!query) return;
    setLoadingCompanies(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/companies/companyNames?query=${query}`);
      setCompanyOptions(response.data || []);
    } catch (err) {
      console.error('Error fetching companies', err);
    } finally {
      setLoadingCompanies(false);
    }
  }, 500);

  return (
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
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Create Your Account
          </Typography>

          <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
            Start your journey with us
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
            freeSolo
            clearOnBlur
            openOnFocus={false}
            options={skillOptions}
            getOptionLabel={(option) => option}
            value={formData.skills}
            onChange={handleSkillsChange}
            onInputChange={(e, value, reason) => {
                if (reason === 'input') {
                fetchSkills(value);
                } else if (reason === 'clear') {
                setSkillOptions([]);
                }
            }}
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
              disabled={formData.role !== 'Employer'}
              options={companyOptions}
              getOptionLabel={(option) => option}
              value={formData.company}
              onChange={handleCompanyChange}
              onInputChange={(e, value) => fetchCompanies(value)}
              loading={loadingCompanies}
              renderInput={(params) => (
                <TextField
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
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              sx={{
                backgroundColor: '#0a66c2',
                '&:hover': {
                  backgroundColor: '#004182',
                },
                fontWeight: 'bold',
                py: 1.5,
              }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
