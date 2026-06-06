import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  FolderOpen,
  Group,
  HourglassTop,
  PieChart,
  BarChart,
} from "@mui/icons-material";
import AuthUser, { getDashboard } from "../../services/AdminService";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import { useEffect, useState } from "react";
import UserDashboard from "../../components/dashboard/UserDashboard";
import { toast } from "react-toastify";
import socket from "../../Socket";

export default function Dashboard() {
  const { user } = AuthUser();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    socket.on("notification", (data) => {
      fetchDashboard();
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await getDashboard();

      setDashboard(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user.role === "Admin" ? (
        <AdminDashboard dashboard={dashboard} />
      ) : (
        <UserDashboard dashboard={dashboard} />
      )}
    </>
  );
}
