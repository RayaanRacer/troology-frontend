import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Avatar,
  Box,
  Stack,
  FormControlLabel,
  Checkbox,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { toast } from "react-toastify";

import AuthUser, { userLoginService } from "../../services/AdminService";
import socket from "../../Socket";

export default function Login() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = AuthUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await userLoginService(data);

      // Adjust according to your API response
      const { token, user } = response.data;

      setToken(user, token, token);

      toast.success(response?.message || "Login Successful");
      if (user?.id) {
        socket.emit("register", user.id);
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <Box sx={{ width: "100%", maxWidth: 440, mx: "auto" }}>
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Stack spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography variant="h5" fontWeight="700">
              Welcome Back
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Login to your account
            </Typography>
          </Stack>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">Remember me</Typography>}
                />

                <Link href="#" underline="hover" variant="body2">
                  Forgot?
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{ py: 1.5, mt: 0.5 }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          align="center"
          sx={{ display: "block", mt: 2, color: "text.secondary" }}
        >
          Don't have an account?&nbsp;
          <Button variant="text" onClick={() => setOpen(true)}>
            Sign Up
          </Button>
          {/* Popup */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Registration Restricted</DialogTitle>

            <DialogContent>
              <DialogContentText>
                User registrations are managed exclusively by the administrator.
                Please contact your administrator to create an account for you.
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpen(false)} variant="contained">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Typography>
      </Box>
    </div>
  );
}
