import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";

import {
  Groups,
  FolderCopy,
  PendingActions,
  TaskAlt,
  AccessTime,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import { getDashboard } from "../../services/AdminService";

const StatCard = ({ title, value, icon, color }) => (
  <Card
    sx={{
      borderRadius: 4,
      height: "100%",
      transition: ".3s",
      background: "linear-gradient(135deg,#ffffff,#f8fafc)",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: 8,
      },
    }}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" fontWeight={600}>
            {title}
          </Typography>

          <Typography variant="h3" fontWeight={700} mt={1}>
            {value}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: color,
            width: 60,
            height: 60,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await getDashboard();

      setDashboard(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}

        <Card
          sx={{
            mb: 4,
            borderRadius: 6,
            background: "linear-gradient(135deg,#2563eb,#4338ca)",
            color: "#fff",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h3" fontWeight={700}>
                  Admin Dashboard
                </Typography>

                <Typography mt={1} sx={{ opacity: 0.9 }}>
                  Monitor projects, users and productivity from one place.
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "rgba(255,255,255,.15)",
                  fontSize: 36,
                }}
              ></Avatar>
            </Stack>
          </CardContent>
        </Card>

        {/* Stats */}

        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Users"
              value={dashboard.totalUsers}
              icon={<Groups />}
              color="#2563eb"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Projects"
              value={dashboard.totalProjects}
              icon={<FolderCopy />}
              color="#0891b2"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Pending"
              value={dashboard.projectsByStatus.Pending}
              icon={<PendingActions />}
              color="#f59e0b"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Completed"
              value={dashboard.projectsByStatus.Completed}
              icon={<TaskAlt />}
              color="#22c55e"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} className="pt-4">
          {/* Left */}

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card
              sx={{
                borderRadius: 5,
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={4}>
                  Project Status
                </Typography>

                {[
                  {
                    title: "Pending",
                    value: dashboard.projectsByStatus.Pending,
                    color: "#f59e0b",
                  },
                  {
                    title: "In Progress",
                    value: dashboard.projectsByStatus["In-Progress"],
                    color: "#3b82f6",
                  },
                  {
                    title: "Completed",
                    value: dashboard.projectsByStatus.Completed,
                    color: "#22c55e",
                  },
                ].map((item) => (
                  <Box mb={4} key={item.title}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Typography fontWeight={600}>{item.title}</Typography>

                      <Typography fontWeight={700}>{item.value}</Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={
                        dashboard.totalProjects
                          ? (item.value * 100) / dashboard.totalProjects
                          : 0
                      }
                      sx={{
                        height: 10,
                        borderRadius: 10,
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Right */}

          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ borderRadius: 5 }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={4}>
                  Projects Ending Soon
                </Typography>

                <Stack spacing={3}>
                  {dashboard.projectsEndingWithin7Days.length === 0 && (
                    <Paper
                      sx={{
                        p: 5,
                        borderRadius: 4,
                        textAlign: "center",
                      }}
                    >
                      <Typography color="text.secondary">
                        🎉 No projects are ending within 7 days.
                      </Typography>
                    </Paper>
                  )}

                  {dashboard.projectsEndingWithin7Days.map((project) => (
                    <Paper
                      key={project._id}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        transition: ".3s",

                        "&:hover": {
                          boxShadow: 8,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Stack
                        direction={{
                          xs: "column",
                          md: "row",
                        }}
                        justifyContent="space-between"
                      >
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight={700}>
                            {project.title}
                          </Typography>

                          <Typography mt={1} color="text.secondary">
                            {project.description}
                          </Typography>

                          <Stack direction="row" spacing={1} mt={2}>
                            <Chip
                              label={project.status}
                              color={
                                project.status === "Completed"
                                  ? "success"
                                  : project.status === "In-Progress"
                                    ? "warning"
                                    : "default"
                              }
                            />

                            <Chip
                              icon={<AccessTime />}
                              label={new Date(
                                project.endDate,
                              ).toLocaleDateString()}
                            />
                          </Stack>
                        </Box>

                        <AvatarGroup max={5}>
                          {project.assignedUsers.map((item) => (
                            <Avatar key={item._id}>{item.user.name[0]}</Avatar>
                          ))}
                        </AvatarGroup>
                      </Stack>

                      <Divider sx={{ my: 3 }} />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography>Progress</Typography>

                        <Typography fontWeight={700}>
                          {project.progress}%
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                          height: 10,
                          borderRadius: 10,
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
