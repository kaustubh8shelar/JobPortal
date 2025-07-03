import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, Box, IconButton, MenuItem, Menu,
  Tooltip, Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import GlobalStyles from "../styles/GlobalStyles";

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const rawRole = localStorage.getItem("role");
  const role = rawRole ? rawRole.toLowerCase() : "";

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Home", icon: <HomeIcon sx={{ color: "text.secondary" }} />, link: "/" },
    ...(role !== "employer" ? [
      { label: "Applications", icon: <WorkIcon sx={{ color: "text.secondary" }} />, link: "/applications" },
      { label: "Search Jobs", icon: <SearchIcon sx={{ color: "text.secondary" }} />, link: "/search-jobs" },
    ] : [])
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", color: "#000", boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Box component="img" src="/JobNudge_Logo.png" alt="Job Portal Logo" sx={{ height: 25 }} />
          </Box>

          {/* Menu Items */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {menuItems.map((item) => (
              <Tooltip title={item.label} key={item.label}>
                <IconButton
                  component={Link}
                  to={item.link}
                  color="inherit"
                  sx={GlobalStyles.iconButtonStyle}
                >
                  {item.icon}
                  <Typography variant="caption" sx={{ mt: 0.5, color: "text.primary" }}>
                    {item.label}
                  </Typography>
                </IconButton>
              </Tooltip>
            ))}
            <Divider orientation="vertical" flexItem />

            {/* Profile & Logout */}
            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ display: "flex", flexDirection: "column", color: "#999" }}
              >
                <AccountCircle sx={{ fontSize: 28, color: "#999" }} />
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
                <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    const confirmLogout = window.confirm("Are you sure you want to logout?");
                    if (confirmLogout) {
                      localStorage.clear();
                      window.location.href = "/logout";
                    }
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Pushes content below navbar */}
    </Box>
  );
}
