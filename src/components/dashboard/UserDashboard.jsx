import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  Assignment,
  PendingActions,
  Autorenew,
  TaskAlt,
  CalendarMonth,
  AttachFile,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import { getDashboard } from "../../services/AdminService";

const StatCard = ({ title, value, icon, color }) => (
  <Card
    sx={{
      borderRadius: 4,
      height: "100%",
      background: "linear-gradient(135deg,#ffffff,#f8fafc)",
      transition: ".3s",
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

export default function UserDashboard() {
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
            background: "linear-gradient(135deg,#2563eb,#4f46e5)",
            color: "white",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h3" fontWeight={700}>
              Welcome Back
            </Typography>

            <Typography mt={1} sx={{ opacity: 0.85 }}>
              Track your projects, deadlines and productivity from one place.
            </Typography>
          </CardContent>
        </Card>

        {/* Stats */}

        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Assigned"
              value={dashboard.totalAssignedProjects}
              icon={<Assignment />}
              color="#2563eb"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Pending"
              value={dashboard.pendingProjects}
              icon={<PendingActions />}
              color="#f59e0b"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="In Progress"
              value={dashboard.inProgressProjects}
              icon={<Autorenew />}
              color="#0ea5e9"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Completed"
              value={dashboard.completedProjects}
              icon={<TaskAlt />}
              color="#22c55e"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} className="pt-4">
          {/* Recent Projects */}

          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ borderRadius: 5 }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={4}>
                  Recent Projects
                </Typography>

                <Stack spacing={3}>
                  {dashboard.recentProjects.map((project) => (
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
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight={700}>
                            {project.title}
                          </Typography>

                          <Typography mt={1} color="text.secondary">
                            {project.description}
                          </Typography>
                        </Box>

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
                      </Stack>

                      <Stack direction="row" spacing={2} mt={3}>
                        <Chip
                          icon={<AttachFile />}
                          label={`${project.attachments.length} Files`}
                        />

                        <Chip
                          icon={<CalendarMonth />}
                          label={new Date(project.endDate).toLocaleDateString()}
                        />
                      </Stack>

                      <Box mt={3}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="body2">Progress</Typography>

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
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Deadlines */}

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ borderRadius: 5 }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={4}>
                  Upcoming Deadlines
                </Typography>

                <Stack spacing={2}>
                  {dashboard.upcomingDeadlines.map((project) => (
                    <Paper
                      key={project._id}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Typography fontWeight={700}>{project.title}</Typography>

                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Due on {new Date(project.endDate).toLocaleDateString()}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                          mt: 2,
                          height: 8,
                          borderRadius: 10,
                        }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <Typography variant="caption">
                          {project.progress}% Completed
                        </Typography>

                        <Chip
                          size="small"
                          label={project.status}
                          color={
                            project.status === "Completed"
                              ? "success"
                              : project.status === "In-Progress"
                                ? "warning"
                                : "default"
                          }
                        />
                      </Stack>
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
