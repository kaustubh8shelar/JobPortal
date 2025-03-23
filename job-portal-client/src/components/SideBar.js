import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Divider, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  const menuItems = [
    { text: "Home", link: "/", icon: <HomeIcon /> },
    { text: "View Applications", link: "/applications", icon: <WorkIcon /> },
    { text: "Search Jobs", link: "/search-jobs", icon: <SearchIcon /> }
  ];

  return (
    <>
      <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => (window.location.href = item.link)}>
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ ml: 2 }} />
                </ListItemButton>
              </ListItem>
              {index !== menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
