import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  LinearProgress,
} from "@mui/material";

import { Add, Search, Edit, AttachFile, Visibility } from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";

import { projectListService } from "../../services/ProjectService";
import AuthUser from "../../services/AdminService";

export default function Projects() {
  const navigate = useNavigate();
  const { user } = AuthUser();

  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    getProjects();
  }, [paginationModel.page, paginationModel.pageSize, search]);

  const getProjects = async () => {
    try {
      setLoading(true);

      const response = await projectListService({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search,
      });

      setProjects(
        response.projects.map((item) => ({
          ...item,
          id: item._id,
        })),
      );

      setRowCount(response.total);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Project",
      flex: 1.4,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => {
        const color =
          params.value === "Completed"
            ? "success"
            : params.value === "In-Progress"
              ? "warning"
              : "default";

        return <Chip size="small" color={color} label={params.value} />;
      },
    },

    {
      field: "progress",
      headerName: "Progress",
      flex: 1,
      renderCell: (params) => (
        <div className="w-full px-2">
          <LinearProgress variant="determinate" value={params.value} />

          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {params.value}%
          </Typography>
        </div>
      ),
    },

    {
      field: "assignedUsers",
      headerName: "Assigned Users",
      flex: 1.3,
      sortable: false,
      renderCell: (params) => (
        <AvatarGroup max={4}>
          {params.value.map((item) => (
            <Avatar key={item._id}>{item.user.name.charAt(0)}</Avatar>
          ))}
        </AvatarGroup>
      ),
    },

    {
      field: "attachments",
      headerName: "Files",
      width: 100,
      renderCell: (params) => (
        <Chip size="small" icon={<AttachFile />} label={params.value.length} />
      ),
    },

    {
      field: "startDate",
      headerName: "Start",
      flex: 0.9,
      valueGetter: (_, row) => new Date(row.startDate).toLocaleDateString(),
    },

    {
      field: "endDate",
      headerName: "End",
      flex: 0.9,
      valueGetter: (_, row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => navigate(`/project-details/${params.row._id}`)}
          >
            View
          </Button>
          {user?.role == "Admin" && (
            <Button
              size="small"
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/project/${params.row._id}`)}
            >
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <Typography variant="h4" fontWeight={700}>
            Projects
          </Typography>

          <Typography color="text.secondary">
            Manage all projects from one place.
          </Typography>
        </div>

        {user?.role == "Admin" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/project/create")}
          >
            Create Project
          </Button>
        )}
      </div>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <div className="mb-5">
            <TextField
              fullWidth
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <DataGrid
            autoHeight
            rows={projects}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            paginationMode="server"
            rowCount={rowCount}
            pageSizeOptions={[5, 10, 20, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            sx={{
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                fontWeight: 700,
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f5f9",
              },

              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
