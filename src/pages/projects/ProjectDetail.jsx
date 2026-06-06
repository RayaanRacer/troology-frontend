import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateProjectStatus } from "../../services/ProjectService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  Divider,
  LinearProgress,
  Stack,
  CircularProgress,
  Paper,
  DialogActions,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  MenuItem,
} from "@mui/material";

import {
  ArrowBack,
  Edit,
  CalendarMonth,
  AttachFile,
  Person,
  Description,
  Download,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import { projectDetailsService } from "../../services/ProjectService";
import AuthUser from "../../services/AdminService";

export default function ProjectDetails() {
  const { id } = useParams();

  const { user } = AuthUser();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [project, setProject] = useState(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const [statusData, setStatusData] = useState({
    status: project?.status || "Pending",
    progress: project?.progress || 0,
    userRemark: "",
  });

  const [statusLoading, setStatusLoading] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);

      const res = await projectDetailsService(id);

      setProject(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);
  useEffect(() => {
    if (project) {
      setStatusData({
        status: project.status,
        progress: project.progress,
        userRemark: "",
      });
    }
  }, [project]);

  const handleUpdateStatus = async () => {
    try {
      setStatusLoading(true);

      await updateProjectStatus(project._id, statusData);

      toast.success("Project status updated successfully");

      setOpenStatusModal(false);

      fetchProject();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update project status",
      );
    } finally {
      setStatusLoading(false);
    }
  };

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
    <div className="bg-slate-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <div>
              <Typography variant="h4" fontWeight={700}>
                {project.title}
              </Typography>

              <Typography color="text.secondary">Project Details</Typography>
            </div>
          </div>

          <Box display="flex" gap={2}>
            {user?.role === "Admin" && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => navigate(`/project/update/${project._id}`)}
              >
                Edit Project
              </Button>
            )}

            {user?.role !== "Admin" && (
              <Button
                variant="contained"
                color="warning"
                startIcon={<Edit />}
                onClick={() => setOpenStatusModal(true)}
              >
                Edit Status
              </Button>
            )}
          </Box>
        </div>

        <Grid container spacing={3}>
          {/* Left */}

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Overview
                </Typography>

                <Typography color="text.secondary" sx={{ lineHeight: 2 }}>
                  {project.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={2}>
                      <CalendarMonth color="primary" />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Start Date
                        </Typography>

                        <Typography fontWeight={600}>
                          {new Date(project.startDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={2}>
                      <CalendarMonth color="error" />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          End Date
                        </Typography>

                        <Typography fontWeight={600}>
                          {new Date(project.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>

                    <Chip
                      sx={{ mt: 1 }}
                      color={
                        project.status === "Completed"
                          ? "success"
                          : project.status === "In-Progress"
                            ? "warning"
                            : "default"
                      }
                      label={project.status}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>

                    <LinearProgress
                      sx={{
                        mt: 1,
                        height: 10,
                        borderRadius: 10,
                      }}
                      variant="determinate"
                      value={project.progress}
                    />

                    <Typography variant="body2" mt={1} fontWeight={600}>
                      {project.progress}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Assigned Users */}

            <Card
              sx={{
                borderRadius: 4,
                mt: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={3}>
                  Assigned Users
                </Typography>

                <Grid container spacing={2}>
                  {project.assignedUsers.map((item) => (
                    <Grid key={item._id} size={{ xs: 12, md: 6 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: "#f8fafc",
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar>{item.user.name.charAt(0)}</Avatar>

                          <Box flex={1}>
                            <Typography fontWeight={700}>
                              {item.user.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {item.user.email}
                            </Typography>
                          </Box>

                          <Chip size="small" label={item.status} />
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="caption" color="text.secondary">
                          Admin Remark
                        </Typography>

                        <Typography>{item.adminRemark}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Attachments */}

            <Card
              sx={{
                borderRadius: 4,
                mt: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={3}>
                  Attachments
                </Typography>

                <Grid container spacing={2}>
                  {project.attachments.map((file) => (
                    <Grid key={file.publicId} size={{ xs: 12, md: 6 }}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 3,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <AttachFile color="primary" />

                            <Box>
                              <Typography fontWeight={600}>
                                {file.fileName}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(file.uploadedAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </Stack>

                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Download />}
                            href={file.url}
                            target="_blank"
                          >
                            View
                          </Button>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right */}

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={3}>
                  Project Summary
                </Typography>

                <Stack spacing={3}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Assigned Users
                    </Typography>

                    <Typography variant="h4" fontWeight={700}>
                      {project.assignedUsers.length}
                    </Typography>

                    <AvatarGroup max={5} sx={{ mt: 2 }}>
                      {project.assignedUsers.map((item) => (
                        <Avatar key={item._id}>
                          {item.user.name.charAt(0)}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Attachments
                    </Typography>

                    <Typography variant="h4" fontWeight={700}>
                      {project.attachments.length}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Created At
                    </Typography>

                    <Typography fontWeight={600}>
                      {new Date(project.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Last Updated
                    </Typography>

                    <Typography fontWeight={600}>
                      {new Date(project.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Completion
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        mt: 1,
                        height: 12,
                        borderRadius: 10,
                      }}
                    />

                    <Typography mt={1} fontWeight={600}>
                      {project.progress}% Completed
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Project Status</DialogTitle>

        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Status"
            value={statusData.status}
            onChange={(e) =>
              setStatusData({
                ...statusData,
                status: e.target.value,
              })
            }
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In-Progress">In-Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Progress (%)"
            inputProps={{
              min: 0,
              max: 100,
            }}
            value={statusData.progress}
            onChange={(e) =>
              setStatusData({
                ...statusData,
                progress: Number(e.target.value),
              })
            }
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="Your Remark"
            value={statusData.userRemark}
            onChange={(e) =>
              setStatusData({
                ...statusData,
                userRemark: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenStatusModal(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={statusLoading}
          >
            {statusLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
