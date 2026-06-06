import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Menu,
  Dashboard,
  Group,
  Folder,
  Person,
  Logout,
} from "@mui/icons-material";
import AuthUser from "../../services/AdminService";
import NotificationBell from "./NotificationBell";

const drawerWidth = 260;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout: logoutService } = AuthUser();

  const navigate = useNavigate();

  const logout = () => {
    logoutService();
    navigate("/login");
  };

  const sidebar = (
    <div className="h-full bg-[#0f172a] text-white flex flex-col">
      <div className="py-8 text-center">
        <Avatar
          sx={{
            width: 70,
            height: 70,
            margin: "auto",
          }}
          src={user?.avatar}
        />

        <Typography mt={2} fontWeight={700}>
          <b>{user?.name}</b>
        </Typography>

        <Typography fontSize={13} color="gray">
          {user?.designation}
        </Typography>
      </div>

      <Divider sx={{ bgcolor: "#334155" }} />

      <List>
        <NavLink to="/dashboard">
          <ListItemButton className="!mx-3 !my-1 !rounded-lg">
            <ListItemIcon>
              <Dashboard sx={{ color: "white" }} />
            </ListItemIcon>

            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </NavLink>

        {user?.role == "Admin" && (
          <NavLink to="/user">
            <ListItemButton className="!mx-3 !my-1 !rounded-lg">
              <ListItemIcon>
                <Group sx={{ color: "white" }} />
              </ListItemIcon>

              <ListItemText primary="Users" />
            </ListItemButton>
          </NavLink>
        )}

        <NavLink to="/projects">
          <ListItemButton className="!mx-3 !my-1 !rounded-lg">
            <ListItemIcon>
              <Folder sx={{ color: "white" }} />
            </ListItemIcon>

            <ListItemText primary="Projects" />
          </ListItemButton>
        </NavLink>

        <NavLink to="/profile">
          <ListItemButton className="!mx-3 !my-1 !rounded-lg">
            <ListItemIcon>
              <Person sx={{ color: "white" }} />
            </ListItemIcon>

            <ListItemText primary="My Profile" />
          </ListItemButton>
        </NavLink>
      </List>

      <div className="mt-auto p-4">
        <ListItemButton onClick={logout} className="!rounded-lg">
          <ListItemIcon>
            <Logout sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "black",
          width: {
            sm: `calc(100% - ${drawerWidth}px)`,
          },
          ml: {
            sm: `${drawerWidth}px`,
          },
        }}
      >
        <Toolbar>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>

          <Typography
            sx={{
              flexGrow: 1,
              fontWeight: 700,
            }}
          >
            Project Management System
          </Typography>

          <div className="flex items-center gap-3">
            <NotificationBell />

            {/* <Avatar src={user?.avatar} /> */}
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {sidebar}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: 0,
          },
        }}
        open
      >
        {sidebar}
      </Drawer>

      <main
        className="flex-1 bg-slate-100 min-h-screen p-6"
        style={{
          marginTop: 64,
          marginLeft: 260,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
