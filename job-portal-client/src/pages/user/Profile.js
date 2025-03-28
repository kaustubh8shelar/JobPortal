import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Avatar, Grid, CircularProgress, Divider, Stack } from "@mui/material";
import { getCurrentUser } from "../../api/user";
import Navbar from "../../components/Navbar";
import GlobalStyles from "../../styles/GlobalStyles";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getCurrentUser();
        console.log("Curr User: ", response);
        setUser(response);
      } catch (error) {
        console.error("Error fetching user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <CircularProgress style={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <div>
    <Navbar />
    <Container maxWidth="md" sx={GlobalStyles.container}>
      <Card sx={GlobalStyles.card}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar src={user?.profilePicture || "/default-avatar.png"} alt="Profile" sx={{ width: 120, height: 120, bgcolor: "#0a66c2" }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={GlobalStyles.title}>
                {user?.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" sx={GlobalStyles.company}>
                {user?.email}
              </Typography>
              <Typography variant="subtitle1" sx={GlobalStyles.location}>
                {user?.location}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={GlobalStyles.divider} />
          <Typography variant="h6" sx={GlobalStyles.title}>
            About Me
          </Typography>
          <Typography variant="body1" sx={GlobalStyles.jobDescription}>
            {user?.bio || "No bio available."}
          </Typography>
          <Divider sx={GlobalStyles.divider} />
          <Typography variant="h6" sx={GlobalStyles.title}>
            Skills
          </Typography>
          <Stack direction="row" spacing={1} sx={GlobalStyles.skillsStack}>
            {user?.skills?.length ? user.skills.map((skill, index) => (
              <Typography key={index} variant="body2" sx={{ bgcolor: "#0a66c2", color: "#fff", px: 2, py: 0.5, borderRadius: 1 }}>
                {skill}
              </Typography>
            )) : <Typography color="textSecondary">No skills listed.</Typography>}
          </Stack>
          <Divider sx={GlobalStyles.divider} />
          <Typography variant="h6" sx={GlobalStyles.title}>
            Experience
          </Typography>
          <Typography variant="body1" sx={GlobalStyles.experience}>
            {user?.experience ? `${user.experience} years` : "No experience data available."}
          </Typography>
        </CardContent>
      </Card>
    </Container>
    </div>
  );
};

export default Profile;