import { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
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
      await getUserByEmail(email);
      navigate("/jobs");
    } catch (error) {
      alert("Login failed");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white", minHeight: 300 }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="rectangular" height={56} sx={{ my: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
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
                  )
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Login;
