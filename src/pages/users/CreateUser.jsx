import { useState } from "react";
import { useForm } from "react-hook-form";
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
  Lock,
  Phone,
  Work,
  AdminPanelSettings,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import { userCreateService } from "../../services/AdminService";

export default function CreateUser() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "User",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await userCreateService(data);

      toast.success(response?.data?.message || "User created successfully.");

      reset({
        name: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
        role: "User",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: "#fff",
    },
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 lg:p-10">
      {/* Header */}

      <div className="mb-8">
        <Typography variant="h4" fontWeight={700}>
          Create User
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Add a new user and assign their role within the Project Management
          System.
        </Typography>
      </div>

      <Card
        elevation={0}
        className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto"
      >
        {/* Top Header */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <Typography variant="h5" fontWeight="bold" color="white">
            User Information
          </Typography>

          <Typography color="#dbeafe" mt={1}>
            Fill in the details below to create a new user.
          </Typography>
        </div>

        <CardContent className="!p-8">
          <div className="mb-6">
            <Typography fontSize={18} fontWeight={700}>
              Personal Details
            </Typography>

            <Typography color="text.secondary">
              Basic information about the employee.
            </Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              {/* Name */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  {...register("name", {
                    required: "Name is required",
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              {/* Email */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              {/* Password */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>

              {/* Phone */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10 digit phone number",
                    },
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>

              {/* Designation */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  {...register("designation", {
                    required: "Designation is required",
                  })}
                  error={!!errors.designation}
                  helperText={errors.designation?.message}
                />
              </Grid>

              {/* Role */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  defaultValue="User"
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettings color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  {...register("role", {
                    required: "Role is required",
                  })}
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  <MenuItem value="Admin">👑 Admin</MenuItem>

                  <MenuItem value="User">👤 User</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Divider className="!my-8" />

            <div className="flex justify-end gap-4">
              <Button
                variant="outlined"
                size="large"
                onClick={() =>
                  reset({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    designation: "",
                    role: "User",
                  })
                }
                sx={{
                  borderRadius: "12px",
                  px: 5,
                  textTransform: "none",
                }}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                type="submit"
                size="large"
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  px: 5,
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
