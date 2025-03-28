import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Autocomplete, Card, CardContent, Typography, CircularProgress, Container } from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";

const SearchJobs = () => {
  const [filters, setFilters] = useState({
    location: "",
    requiredExperience: "",
    skillsRequired: [],
  });

  const [locations, setLocations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSkill, setSearchSkill] = useState("");

  useEffect(() => {
    if (!searchLocation.trim()) {
      setLocations([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        setLocationsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/jobs/locations?query=${searchLocation}`);
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations", error);
      } finally {
        setLocationsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchLocation]);

  useEffect(() => {
    if (!searchSkill.trim()) {
      setSkills([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        setSkillsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/jobs/skills?query=${searchSkill}`);
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills", error);
      } finally {
        setSkillsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchSkill]);

  const handleLocationChange = (event, newValue) => {
    setSearchLocation(newValue || "");
    setFilters({ ...filters, location: newValue || "" });
    setTimeout(() => setLocations([]), 100);
  };

  const handleSkillsChange = (event, newValue) => {
    setSearchSkill("");
    setFilters({ ...filters, skillsRequired: newValue || [] });
    setTimeout(() => setSkills([]), 100);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      console.log("Filters: ", filters);
      const response = await axios.get("http://localhost:8080/api/jobs", {
        params: {
          ...filters,
          skillsRequired: filters.skillsRequired.join(","),
        },
      });
      console.log("response : ",response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography 
          variant="h5" 
          sx={{ my: 4, textAlign: "center", fontWeight: "bold", color: "#0a66c2" }}
        >
          Search Jobs
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              options={locations}
              value={filters.location}
              onInputChange={(event, newValue) => setSearchLocation(newValue || "")}
              onChange={handleLocationChange}
              freeSolo
              loading={locationsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Location"
                  placeholder="Start typing..."
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {locationsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Experience (Years)"
              name="requiredExperience"
              value={filters.requiredExperience}
              onChange={(e) => setFilters({ ...filters, requiredExperience: e.target.value })}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={skills}
              value={filters.skillsRequired}
              onInputChange={(event, newValue) => setSearchSkill(newValue || "")}
              onChange={handleSkillsChange}
              freeSolo
              loading={skillsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Skills"
                  placeholder="Start typing..."
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {skillsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 3, display: "block", mx: "auto" }}>
          Search
        </Button>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {loading ? (
            <Typography textAlign="center" width="100%">Loading...</Typography>
          ) : (
            jobs.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>{job.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{job.location}</Typography>
                    <Typography variant="body2">Experience: {job.requiredExperience} years</Typography>
                    <Typography variant="body2">Skills: {job.skillsRequired.join(", ")}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default SearchJobs;
