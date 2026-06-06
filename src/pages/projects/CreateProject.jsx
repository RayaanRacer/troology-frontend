import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Divider,
  Box,
} from "@mui/material";

import { toast } from "react-toastify";

import AttachmentUploader from "../../components/project/AttachmentUploader";
import AssignedUsersSection from "../../components/project/AssignedUsersSection";

import { projectCreationService } from "../../services/ProjectService";
import { userListService } from "../../services/AdminService";

export default function CreateProject() {
  const [loading, setLoading] = useState(false);

  const [attachments, setAttachments] = useState([]);

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Pending",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      if (assignedUsers.length === 0) {
        toast.error("Assign at least one user.");
        return;
      }

      const payload = {
        ...formData,

        assignedUsers,

        attachments,
      };

      const response = await projectCreationService(payload);

      toast.success(response?.data?.message || "Project created successfully.");

      reset();

      setAttachments([]);

      setAssignedUsers([]);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create project.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    userListService()
      .then((res) => {
        console.log(res);
        setUsers(res?.users);
      })
      .catch((err) => {
        toast?.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Create Project
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Create and assign a new project.
        </Typography>

        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Project Title */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name="title"
                    rules={{
                      required: "Project title is required",
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Project Title"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name="description"
                    rules={{
                      required: "Description is required",
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={5}
                        label="Description"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Start Date */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    Start Date
                  </Typography>

                  <Controller
                    control={control}
                    name="startDate"
                    rules={{
                      required: "Start date is required",
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>

                {/* End Date */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    End Date
                  </Typography>

                  <Controller
                    control={control}
                    name="endDate"
                    rules={{
                      required: "End date is required",
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Status */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    Status
                  </Typography>

                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <TextField {...field} fullWidth select>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In-Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 5 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Assigned Users
              </Typography>

              <AssignedUsersSection
                users={users}
                assignedUsers={assignedUsers}
                setAssignedUsers={setAssignedUsers}
              />

              <Divider sx={{ my: 5 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Attachments
              </Typography>

              <AttachmentUploader
                attachments={attachments}
                setAttachments={setAttachments}
              />

              <Divider sx={{ my: 5 }} />

              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
