import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getNotifications,
  deleteNotification,
  editNotification,
} from "../../api/notifications";
import { z } from "zod";

interface Notification {
  _id: string;
  searchQuery: string | string[];
  relevancyScore: number;
  frequency: string;
  receivers: string[];
}

interface NotificationTableProps {
  token: string;
  refresh: boolean;
  onRefresh: () => void;
}

export default function NotificationTable({
  token,
  refresh,
  onRefresh,
}: NotificationTableProps) {
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editLoading, setEditLoading] = useState<boolean>(false);

  const rowsPerPage = 5;

  const notificationSchema = z.object({
    receivers: z
      .array(z.string().email("Invalid email address"))
      .nonempty("At least one receiver is required"),
    searchQuery: z
      .array(z.string().nonempty("Search query cannot be empty"))
      .nonempty("Please enter at least one search query"),
    relevancyScore: z.number().min(1).max(5),
    frequency: z.enum(["Daily", "Weekly", "Monthly"]),
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getNotifications(token);
        const normalizedData = data.map((notification: Notification) => ({
          ...notification,
          searchQuery: Array.isArray(notification.searchQuery)
            ? notification.searchQuery
            : [notification.searchQuery],
        }));
        setNotifications(normalizedData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [token, refresh]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDelete.id) {
      try {
        await deleteNotification(token, confirmDelete.id);
        setConfirmDelete({ open: false, id: null });
        onRefresh();
      } catch (error) {
        console.error("Error deleting notification:", error);
        setError("Failed to delete notification.");
        setConfirmDelete({ open: false, id: null });
      }
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({ open: false, id: null });
  };

  const handleEditClick = (notification: Notification) => {
    setCurrentNotification({
      ...notification,
      searchQuery: Array.isArray(notification.searchQuery)
        ? notification.searchQuery
        : [notification.searchQuery],
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setCurrentNotification(null);
    setEditErrors({});
  };

  const handleEditSave = async () => {
    if (!currentNotification) return;

    try {
      const validatedData = notificationSchema.parse(currentNotification);
      setEditErrors({});
      setEditLoading(true);

      await editNotification(token, currentNotification._id, validatedData);

      setEditLoading(false);
      setEditDialogOpen(false);
      setCurrentNotification(null);
      onRefresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setEditErrors(fieldErrors);
      } else {
        setError("Failed to update notification.");
      }
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            flexDirection="column"
          >
            <Typography>No notifications found.</Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Search Queries</TableCell>
                  <TableCell align="left">Relevancy Score</TableCell>
                  <TableCell align="left">Frequency</TableCell>
                  <TableCell align="left">Receivers</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((notification, index) => (
                    <TableRow key={notification._id}>
                      <TableCell align="left">
                        {(page - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        {(Array.isArray(notification.searchQuery)
                          ? notification.searchQuery
                          : [notification.searchQuery]
                        ).map((query: string) => (
                          <Chip
                            key={query}
                            label={query}
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell align="left">
                        {notification.relevancyScore}
                      </TableCell>
                      <TableCell align="left">
                        {notification.frequency}
                      </TableCell>
                      <TableCell align="left">
                        {notification.receivers.map((email) => (
                          <Chip
                            key={email}
                            label={email}
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Notification">
                          <IconButton
                            onClick={() => handleEditClick(notification)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Notification">
                          <IconButton
                            onClick={() => handleDeleteClick(notification._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {Math.ceil(notifications.length / rowsPerPage) > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.ceil(notifications.length / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={confirmDelete.open}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete Notification
          </DialogTitle>
          <DialogContent>
            <Typography id="delete-dialog-description">
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="secondary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Notification Dialog */}
        {currentNotification && (
          <Dialog
            open={editDialogOpen}
            onClose={handleEditClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit Notification</DialogTitle>
            <DialogContent>
              {/* Form Fields */}
              <Box sx={{ mt: 2 }}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={
                    Array.isArray(currentNotification.searchQuery)
                      ? currentNotification.searchQuery
                      : [currentNotification.searchQuery]
                  }
                  onChange={(event, newValue) => {
                    setCurrentNotification({
                      ...currentNotification,
                      searchQuery: newValue as string[],
                    });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Search Queries"
                      placeholder="Type and press enter"
                      error={!!editErrors.searchQuery}
                      helperText={
                        editErrors.searchQuery || "Enter search queries"
                      }
                    />
                  )}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  fullWidth
                  label="Relevancy Score (1-5)"
                  type="number"
                  variant="outlined"
                  value={currentNotification.relevancyScore}
                  onChange={(e) =>
                    setCurrentNotification({
                      ...currentNotification,
                      relevancyScore: Number(e.target.value),
                    })
                  }
                  InputProps={{ inputProps: { min: 1, max: 5, step: 1 } }}
                  error={!!editErrors.relevancyScore}
                  helperText={editErrors.relevancyScore}
                  sx={{ marginBottom: "1rem" }}
                />
                <FormControl
                  fullWidth
                  error={!!editErrors.frequency}
                  sx={{ marginBottom: "1rem" }}
                >
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={currentNotification.frequency}
                    onChange={(e) =>
                      setCurrentNotification({
                        ...currentNotification,
                        frequency: e.target.value as
                          | "Daily"
                          | "Weekly"
                          | "Monthly",
                      })
                    }
                    label="Frequency"
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                  </Select>
                  {editErrors.frequency && (
                    <FormHelperText>{editErrors.frequency}</FormHelperText>
                  )}
                </FormControl>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={currentNotification.receivers}
                  onChange={(event, newValue) => {
                    setCurrentNotification({
                      ...currentNotification,
                      receivers: newValue as string[],
                    });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Email Receivers"
                      placeholder="Type and press enter"
                      error={!!editErrors.receivers}
                      helperText={
                        editErrors.receivers || "Enter email addresses"
                      }
                    />
                  )}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditClose} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                variant="contained"
                color="primary"
                disabled={editLoading}
              >
                {editLoading ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </TableContainer>
    </>
  );
}
