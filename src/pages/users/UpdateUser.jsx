import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  InputAdornment,
  Divider,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  Work,
  AdminPanelSettings,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import {
  userDetailsService,
  userUpdateService,
} from "../../services/AdminService";

export default function UpdateUser() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      role: "User",
    },
  });

  useEffect(() => {
    if (id) {
      getUserDetails();
    }
  }, [id]);

  const getUserDetails = async () => {
    try {
      setPageLoading(true);

      const response = await userDetailsService(id);

      const user = response?.data;

      reset({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        designation: user?.designation || "",
        role: user?.role || "User",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch user details.",
      );
    } finally {
      setPageLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { email, ...payload } = data;

      const response = await userUpdateService(payload, id);

      toast.success(response?.message || "User updated successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <CircularProgress size={45} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 lg:p-10">
      <div className="mb-8">
        <Typography variant="h4" fontWeight={700}>
          Update User
        </Typography>

        <Typography color="text.secondary">
          Update user information and permissions.
        </Typography>
      </div>

      <Card
        elevation={0}
        className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-6xl mx-auto"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
          <Typography variant="h5" color="white" fontWeight={700}>
            User Details
          </Typography>

          <Typography color="#dbeafe">
            Edit and save user information.
          </Typography>
        </div>

        <CardContent className="!p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Name is required",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  disabled
                  rules={{
                    required: "Email is required",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone is required",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="designation"
                  control={control}
                  rules={{
                    required: "Designation is required",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Designation"
                      error={!!errors.designation}
                      helperText={errors.designation?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Role"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AdminPanelSettings color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="Admin">👑 Admin</MenuItem>

                      <MenuItem value="User">👤 User</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            <Divider className="!my-8" />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  px: 5,
                  py: 1.3,
                  borderRadius: 3,
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
