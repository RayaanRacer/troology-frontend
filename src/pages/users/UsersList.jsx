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
} from "@mui/material";

import { Add, Search, Edit } from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";

import { userListService } from "../../services/AdminService";

export default function Users() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    getUsers();
  }, [paginationModel.page, paginationModel.pageSize, search]);

  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await userListService({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search,
      });

      setUsers(response.users);

      setRowCount(response.pagination.total);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1.3,
    },

    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },

    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
    },

    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Chip
          size="small"
          color={params.value === "Admin" ? "error" : "primary"}
          label={params.value}
        />
      ),
    },

    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          size="small"
          color={params.value ? "success" : "default"}
          label={params.value ? "Active" : "Inactive"}
        />
      ),
    },

    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          startIcon={<Edit />}
          size="small"
          onClick={() => navigate(`/user/${params.row.id}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <Typography variant="h4" fontWeight={700}>
            Users
          </Typography>

          <Typography color="text.secondary">
            Manage all system users.
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/user/create")}
        >
          Create User
        </Button>
      </div>

      <Card elevation={0} className="rounded-3xl shadow-lg">
        <CardContent>
          <div className="mb-5">
            <TextField
              fullWidth
              placeholder="Search by name or email..."
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
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
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

              "& .MuiDataGrid-cell": {
                alignItems: "center",
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f5f9",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
