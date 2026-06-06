import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";

import { Save } from "@mui/icons-material";

import { toast } from "react-toastify";

import AttachmentUploader from "../../components/project/AttachmentUploader";
import AuthUser, {
  updateProfileService,
  userDetailsService,
} from "../../services/AdminService";

export default function UpdateProfile() {
  const [loading, setLoading] = useState(true);
  const { user } = AuthUser();
  const [saving, setSaving] = useState(false);

  const [attachments, setAttachments] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    avatar: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await userDetailsService(user?.id);

      const data = res.data;

      setForm({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        designation: data.designation || "",
        avatar: data.avatar || "",
      });

      if (data.avatar) {
        setAttachments([
          {
            url: data.avatar,
            public_id: "",
            original_filename: "avatar",
          },
        ]);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (attachments.length > 0) {
      setForm((prev) => ({
        ...prev,
        avatar: attachments[0].url,
      }));
    }
  }, [attachments]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      await updateProfileService({
        name: form.name,
        email: form.email,
        phone: form.phone,
        designation: form.designation,
        avatar: form.avatar,
      });

      toast.success("Profile updated successfully");

      fetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
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
    <div className="bg-slate-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Card
          sx={{
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight={700} mb={4}>
              Update Profile
            </Typography>

            <Box display="flex" justifyContent="center" mb={4}>
              <Avatar
                src={form.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 50,
                }}
              >
                {form.name?.charAt(0)}
              </Avatar>
            </Box>

            <Typography variant="h6" mb={2}>
              Profile Picture
            </Typography>

            <AttachmentUploader
              attachments={attachments}
              setAttachments={setAttachments}
            />

            <Grid container spacing={3} mt={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  disabled
                  label="Email"
                  name="email"
                  value={form.email}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box mt={5} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? "Updating..." : "Update Profile"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
