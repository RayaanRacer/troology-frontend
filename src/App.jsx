import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, Navigate } from "react-router-dom";

import theme from "./theme";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import ProtectedRoute from "./guards/AuthGuard";
import AuthUser from "./services/AdminService";
import DashboardLayout from "./components/layouts/DashboardLayout";
import CreateUser from "./pages/users/CreateUser";
import UpdateUser from "./pages/users/UpdateUser";
import { ToastContainer } from "react-toastify";
import Users from "./pages/users/UsersList";
import CreateProject from "./pages/projects/CreateProject";
import UpdateProject from "./pages/projects/UpdateProject";
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetail";
import UpdateProfile from "./pages/users/UpdateProfile";

function App() {
  const { user } = AuthUser();

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline />

      <Routes>
        {/* Redirect root based on auth status */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/create" element={<CreateUser />} />
            <Route path="/user/:id" element={<UpdateUser />} />
            <Route path="/profile" element={<UpdateProfile />} />
            <Route path="/user" element={<Users />} />
            <Route path="/project/create" element={<CreateProject />} />
            <Route path="/project/:id" element={<UpdateProject />} />
            <Route path="/project-details/:id" element={<ProjectDetails />} />
            <Route path="/projects" element={<Projects />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
