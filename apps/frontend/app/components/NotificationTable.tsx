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
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useEffect } from "react";
import { getNotifications, deleteNotification } from "../../api/notifications";

interface Notification {
  _id: string;
  searchQuery: string;
  relevancyScore: number;
  frequency: string;
  status: string;
}

interface NotificationTableProps {
  token: string;
  handleEdit: (id: string) => void;
  refresh: boolean;
}

export default function NotificationTable({
  token,
  handleEdit,
}: NotificationTableProps) {
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const rowsPerPage = 5;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getNotifications(token);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [token]);

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ open: true, id });
  };

  // Confirm delete action
  const handleDeleteConfirm = async () => {
    if (confirmDelete.id) {
      try {
        await deleteNotification(token, confirmDelete.id);
        // Remove deleted notification from the list
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n._id !== confirmDelete.id)
        );
        setConfirmDelete({ open: false, id: null });
      } catch (error) {
        console.error("Error deleting notification:", error);
        setError("Failed to delete notification.");
        setConfirmDelete({ open: false, id: null });
      }
    }
  };

  // Cancel delete action
  const handleDeleteCancel = () => {
    setConfirmDelete({ open: false, id: null });
  };

  return (
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
                <TableCell align="left">Search Query</TableCell>
                <TableCell align="left">Relevancy Score</TableCell>
                <TableCell align="left">Frequency</TableCell>
                <TableCell align="left">Status</TableCell>
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
                      {notification.searchQuery}
                    </TableCell>
                    <TableCell align="left">
                      {notification.relevancyScore}
                    </TableCell>
                    <TableCell align="left">{notification.frequency}</TableCell>
                    <TableCell align="left">
                      {notification.status === "Active" ? (
                        <Tooltip title="Active">
                          <CheckCircleIcon sx={{ color: "green" }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Inactive">
                          <CancelIcon sx={{ color: "red" }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Notification">
                        <IconButton
                          onClick={() => handleEdit(notification._id)}
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
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this notification? This action
            cannot be undone.
          </DialogContentText>
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
    </TableContainer>
  );
}
