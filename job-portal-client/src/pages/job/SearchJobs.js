import React, { useState, useEffect, useRef  } from "react";
import { 
  TextField, Button, Grid, Autocomplete, Card, CardContent, Typography, 
  CircularProgress, Container, Divider, Box, IconButton, Skeleton
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { getCurrentUser } from "../../api/user";
import { Link } from "react-router-dom";
import { getCompanyById } from "../../api/company"; 
import GlobalStyles from "../../styles/GlobalStyles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SearchJobs = () => {
  const [filters, setFilters] = useState({
    location: "",
    requiredExperience: "",
    skillsRequired: [],
  });

  const [locations, setLocations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [candidateID, setCandidateID] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchError, setSearchError] = useState("");
  const pageSize = 10;

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 320; // adjust based on card width
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getCurrentUser();
        setCandidateID(response.id);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!candidateID) return;
    const fetchRecommendedJobs = async () => {
      try {
        setRecLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/jobs/recommendations/${candidateID}`);
        setRecommendedJobs(response.data);
        await fetchCompanyNames(response.data);
      } catch (error) {
        console.error("Error fetching recommended jobs", error);
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecommendedJobs();
  }, [candidateID]);

  useEffect(() => {
    if (!searchLocation.trim()) {
      setLocations([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        setLocationsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/jobs/locations?query=${searchLocation}`);
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
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/jobs/skills?query=${searchSkill}`);
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills", error);
      } finally {
        setSkillsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchSkill]);

  const fetchCompanyNames = async (jobsList) => {
    const companyData = {};
  
    for (const job of jobsList) {
      if (job.companyId && !companyDetails[job.companyId]) {
        try {
          const response = await getCompanyById(job.companyId);
          companyData[job.companyId] = response.data.name;
        } catch (error) {
          console.error("Error fetching company:", error);
        }
      }
    }
    setCompanyDetails((prev) => ({ ...prev, ...companyData }));
  };
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

  const handleSearch = async (page = 1) => {
    const { location, requiredExperience, skillsRequired } = filters;
  
    // Check if all filters are empty
    if (
      (!location || location.trim() === "") &&
      (!requiredExperience || requiredExperience.trim() === "") &&
      (!skillsRequired || skillsRequired.length === 0)
    ) {
      setSearchError("Please enter keywords to search");
      return;
    }
  
    setSearchError("");
    setLoading(true);
    setSearchPerformed(true);
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/jobs/search`, {
        params: {
          ...filters,
          skillsRequired: skillsRequired.join(","),
          page,
          size: pageSize,
        },
      });
  
      setJobs(response.data.jobs || []);
      setTotalJobs(response.data.totalElements || 0);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
  
      await fetchCompanyNames(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };
  
  

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ my: 4, textAlign: "center", fontWeight: "bold", color: "#0a66c2" }}>
          Search Jobs
        </Typography>

        {/* Search Section */}
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
        {searchError && (
          <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
            {searchError}
          </Typography>
        )}


        <Button variant="contained" color="primary" onClick={() => handleSearch(1)} sx={{ mt: 3, display: "block", mx: "auto" }}>
          Search
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* Search Results */}
        {searchPerformed && totalJobs > 0 && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            Page {currentPage} of {totalPages} of {totalJobs} jobs
          </Typography>
        )}

        {searchPerformed && totalJobs === 0 && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            No jobs found.
          </Typography>
        )}
        <Grid container spacing={2}>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={GlobalStyles.jobCard}>
                <Box sx={{ flex: 1}}>
                    <Skeleton variant="text" height={30} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Skeleton variant="rectangular" height={20} width="30%" />
                      <Skeleton variant="rectangular" height={20} width="30%" />
                    </Box>
                    <Skeleton variant="text" height={20} width="90%" sx={{ mt: 1 }} />
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            jobs.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Card sx={GlobalStyles.jobCard}>
                    <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center"}}>
                      <Typography variant="h6" sx={GlobalStyles.jobTitle}>{job.title}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center"}}>
                      <Typography variant="body2" sx={GlobalStyles.company}>
                        {companyDetails[job.companyId] || "Loading company..."}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5  }}>
                        <WorkOutlineIcon fontSize="small" sx={{ color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">{job.requiredExperience} Yrs</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                      {job.skillsRequired.join(" • ")}
                    </Typography>
                  </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))
          )}
        </Grid>
        {totalJobs > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => handleSearch(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <Typography variant="body2">
              {`${currentPage} of ${totalPages} of ${totalJobs}`}
            </Typography>

            <Button 
              variant="outlined" 
              onClick={() => handleSearch(currentPage + 1)} 
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </Box>
        )}
        {/* Recommended Jobs */}
        <Typography variant="h6" sx={{ mt: 25, mb: 2 }}>
          Jobs you might like
        </Typography>

        {recLoading ? (
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Box key={index} sx={{ minWidth: 300, maxWidth: 300, flex: "0 0 auto" }}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={30} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Skeleton variant="rectangular" height={20} width="30%" />
                      <Skeleton variant="rectangular" height={20} width="30%" />
                    </Box>
                    <Skeleton variant="text" height={20} width="90%" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ position: "relative" }}>
            {/* Scroll Buttons */}
            <IconButton
              onClick={() => scroll("left")}
              sx={{
                position: "absolute",
                left: -40,
                top: "40%",
                zIndex: 1,
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>

            <IconButton
              onClick={() => scroll("right")}
              sx={{
                position: "absolute",
                right: -40,
                top: "40%",
                zIndex: 1,
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>

            {/* Horizontal Scroller */}
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 2,
                pb: 2,
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: 4,
                },
              }}
            >
              {recommendedJobs.map((job) => (
                <Box
                  key={job.id}
                  sx={{
                    minWidth: "300px",
                    maxWidth: "300px",
                    flex: "0 0 auto",
                  }}
                >
                  <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Card sx={GlobalStyles.recommendedJobCard}>
                      <CardContent>
                        <Typography variant="h6">{job.title}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", mt: 0.5 }}>
                          {companyDetails[job.companyId] || "Loading company..."}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <WorkOutlineIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">{job.requiredExperience} Yrs</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                          {job.skillsRequired.join(" • ")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default SearchJobs;
