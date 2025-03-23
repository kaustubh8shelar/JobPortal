import { AppBar, Toolbar, Typography, Box, IconButton, MenuItem, Menu } from "@mui/material";
import { Link } from "react-router-dom";
import Sidebar from "./SideBar";
import * as React from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function NavBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}> 
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", color: "#000", boxShadow: 2 }}> 
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Sidebar />
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontSize: "1.2rem", marginLeft: 2, color: "#000" }}>
              Job Portal
            </Typography>
          </Box>
          {auth && (
            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle sx={{ fontSize: 36, color: "#000" }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: 1 }}
              >
                <MenuItem component={Link} to="/profile" sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>Profile</MenuItem>
                <MenuItem component={Link} to="/logout" sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Adds spacing to push content below fixed navbar */}
    </Box>
  );
}
