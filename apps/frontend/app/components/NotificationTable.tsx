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
  Alert,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getNotifications,
  deleteNotification,
  editNotification,
} from "../../api/notifications";
import EditNotificationModal from "./EditNotificationModal";
import { z } from "zod";

interface Notification {
  _id: string;
  searchQuery: string | string[];
  relevancyScore: number;
  frequency: string;
  receivers: string[];
  days?: string[];
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
  }>({
    open: false,
    id: null,
  });
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
    relevancyScore: z
      .number()
      .min(1)
      .max(5, "Relevancy score must be between 1 and 5"),
    frequency: z.enum(["Daily", "Weekly", "Monthly"]),
    days: z.array(z.string()).optional(),
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
      } catch (err: any) {
        setError(err.message || "Failed to fetch notifications.");
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
        setError("Failed to delete notification.");
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

  const handleEditSave = async (updatedNotification: Notification) => {
    if (!currentNotification) return;

    try {
      const validatedData = notificationSchema.parse(updatedNotification);
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
            <Alert severity="error">{error}</Alert>
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
                        {Array.isArray(notification.searchQuery) &&
                          notification.searchQuery.map((query: string) => (
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
                        {notification.frequency === "Weekly" &&
                          notification.days && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                Selected Days:
                              </Typography>
                              {notification.days.map((day) => (
                                <Chip
                                  key={day}
                                  label={day}
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                          )}
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
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              sx={{
                textTransform: "none",
                backgroundColor: "#f5f5f5",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#ddd",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#FF0000",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#CC0000",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Notification Dialog */}
        {currentNotification && (
          <EditNotificationModal
            open={editDialogOpen}
            notification={currentNotification}
            onClose={handleEditClose}
            onSave={handleEditSave}
            loading={editLoading}
            errors={editErrors}
          />
        )}
      </TableContainer>
    </>
  );
}
