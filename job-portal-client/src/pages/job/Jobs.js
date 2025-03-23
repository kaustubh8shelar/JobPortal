import { useEffect, useState } from "react";
import { getJobs } from "../../api/job";
import {
  Container, Card, CardContent, Typography,
  Pagination, Box, Grid, Avatar, Button
} from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles"; // Import styles

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };
    fetchJobs();
  }, []);

  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h5" sx={GlobalStyles.pageTitle}>
          Recommended Jobs
        </Typography>

        <Grid container spacing={2}>
          {currentJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card sx={GlobalStyles.jobCard}>
                <Avatar sx={GlobalStyles.jobAvatar}>
                  {job.title.charAt(0)}
                </Avatar>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography variant="h6" sx={GlobalStyles.jobTitle}>
                      {job.title}
                    </Typography>
                  </Link>
                  <Typography variant="body2" sx={GlobalStyles.jobLocation}>
                    {job.location}
                  </Typography>
                  <Typography variant="subtitle2" sx={GlobalStyles.jobSalary}>
                    Salary: ₹{job.salary}
                  </Typography>
                </CardContent>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to={`/jobs/${job.id}`}
                >
                  View
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={GlobalStyles.paginationBox}>
          <Pagination
            count={Math.ceil(jobs.length / jobsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            variant="outlined"
            color="primary"
            size="large"
          />
        </Box>
      </Container>
    </div>
  );
};

export default Jobs;
