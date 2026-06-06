import { useEffect, useState } from "react";
import socket from "../../Socket";

import {
  Badge,
  IconButton,
  Menu,
  Avatar,
  Typography,
  Divider,
  Box,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { toast } from "react-toastify";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    socket.on("notification", (data) => {
      toast.success(data.message);

      setNotifications((prev) => [
        {
          id: Date.now(),
          unread: true,
          createdAt: new Date(),
          ...data,
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      })),
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge
          badgeContent={notifications.filter((x) => x.unread).length}
          color="error"
          max={99}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            mt: 1,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 10px 35px rgba(0,0,0,.15)",
          },
        }}
      >
        {/* Header */}

        <Box
          px={3}
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize={18} fontWeight={700}>
            Notifications
          </Typography>

          <Typography fontSize={13} color="primary" fontWeight={600}>
            {notifications.length} New
          </Typography>
        </Box>

        <Divider />

        {/* Empty */}

        {notifications.length === 0 && (
          <Box
            py={8}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <NotificationsIcon
              sx={{
                fontSize: 70,
                color: "#d1d5db",
                mb: 2,
              }}
            />

            <Typography fontWeight={600}>No Notifications</Typography>

            <Typography fontSize={13} color="text.secondary">
              You're all caught up 🎉
            </Typography>
          </Box>
        )}

        {/* List */}

        <Box
          sx={{
            maxHeight: 420,
            overflowY: "auto",
          }}
        >
          {notifications.map((item) => (
            <Box key={item.id}>
              <Box
                sx={{
                  px: 2,
                  py: 2,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  cursor: "pointer",
                  transition: ".2s",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: "#2563eb",
                    flexShrink: 0,
                  }}
                >
                  <AssignmentIcon fontSize="small" />
                </Avatar>

                <Box flex={1}>
                  <Typography fontWeight={600} fontSize={14} lineHeight={1.4}>
                    {item.message}
                  </Typography>

                  <Typography fontSize={12} color="text.secondary" mt={0.5}>
                    {item.createdAt.toLocaleString()}
                  </Typography>
                </Box>

                {item.unread && (
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "#2563eb",
                      borderRadius: "50%",
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                )}
              </Box>

              <Divider />
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
}
