import { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Grid,
  Button,
  Typography,
  Box,
  Skeleton,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import { getUserByEmail } from "../api/user";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data);
      localStorage.setItem("isLoggedIn", "true");
       // Get user details (assuming it includes role)
      const userRes = await getUserByEmail(email);
      const user = userRes.data;
      localStorage.setItem("role", user.role); // Save role separately

      // Navigate based on role
      if (user.role?.toLowerCase() === "employer") {
        navigate("/employer/dashboard", { replace: true });
      } else {
        navigate("/jobs", { replace: true });
      }
    } catch (error) {
      alert("Login failed");
      setLoading(false);
    }
  };

    return (
      <Grid
        container
        sx={{
          height: '100dvh',
          overflow: 'hidden', // Prevents scrollbars
        }}
      >
        {/* LEFT SIDE - Image */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src="/JobNudge_WithSlogan.png"
            alt="Logo with Slogan"
            sx={{
              maxWidth: '60%',
              height: 'auto',
            }}
          />
        </Grid>

        {/* RIGHT SIDE - Login Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            height: '100%', // Ensures it fills container
            overflow: 'hidden', // Just in case
          }}
        >
          <Box sx={{ width: '80%', maxWidth: 400 }}>
            {loading ? (
              <>
                <Skeleton variant="text" width="30%" height={40} />
                <Skeleton variant="rectangular" height={56} sx={{ my: 2 }} />
                <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography>This might take some time. Please wait...</Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                  Login
                </Typography>
                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  />
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                    Login
                  </Button>
                </form>
                <Box textAlign="center" mt={2}>
                  <Typography variant="body2">
                    Don&apos;t have an account?{' '}
                    <Button
                      variant="text"
                      onClick={() => navigate('/register')}
                      sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Register here
                    </Button>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    );

};

export default Login;
