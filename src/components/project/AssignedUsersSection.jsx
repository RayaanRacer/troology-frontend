import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";

import { Add, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function AssignedUsersSection({
  users = [],
  assignedUsers,
  setAssignedUsers,
}) {
  const addUser = () => {
    if (assignedUsers.length >= users.length) {
      toast.warning("All users have already been assigned.");

      return;
    }

    setAssignedUsers([
      ...assignedUsers,
      {
        user: "",
        adminRemark: "",
      },
    ]);
  };

  const removeUser = (index) => {
    const temp = [...assignedUsers];

    temp.splice(index, 1);

    setAssignedUsers(temp);
  };

  const updateUser = (index, field, value) => {
    const temp = [...assignedUsers];

    temp[index][field] = value;

    setAssignedUsers(temp);
  };

  return (
    <div>
      {assignedUsers.map((item, index) => (
        <Card
          key={index}
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Typography fontWeight={700}>
                Assigned User {index + 1}
              </Typography>

              <IconButton color="error" onClick={() => removeUser(index)}>
                <Delete />
              </IconButton>
            </div>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  select
                  label="Select User"
                  value={item.user}
                  onChange={(e) => updateUser(index, "user", e.target.value)}
                >
                  {users
                    .filter(
                      (user) =>
                        // Show current selected user
                        user.id === item.user ||
                        // Hide users already selected in other rows
                        !assignedUsers.some(
                          (assigned, i) =>
                            i !== index && assigned.user === user.id,
                        ),
                    )
                    .map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.designation})
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <TextField
                  fullWidth
                  label="Admin Remark"
                  value={item.adminRemark}
                  onChange={(e) =>
                    updateUser(index, "adminRemark", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addUser}
        disabled={assignedUsers.length >= users.length}
        sx={{
          borderRadius: 3,
          textTransform: "none",
        }}
      >
        Assign User
      </Button>
    </div>
  );
}
