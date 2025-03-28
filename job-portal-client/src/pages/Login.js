import { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { getUserByEmail } from "../api/user";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data);
      const resUser = await getUserByEmail(email);
      console.log("token: "+res.data);
      console.log("userData: "+resUser.data.id);
      navigate("/jobs");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
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
            type="password" 
            label="Password" 
            variant="outlined" 
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
