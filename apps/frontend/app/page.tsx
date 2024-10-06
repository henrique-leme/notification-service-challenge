"use client";

import {
  Box,
  Paper,
  Typography,
  Container,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import NotificationTable from "./components/NotificationTable";
import NotificationCard from "./components/NotificationCard";

export default function DashboardPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoadingToken(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoadingToken(false);
  }, []);

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {loadingToken ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : token ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                mb: 2,
                gap: 2,
              }}
            >
              <Typography variant="h5" component="h1">
                Notifications
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenCreateDialog}
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#555",
                  },
                  textTransform: "none",
                }}
              >
                Create Notification
              </Button>
            </Box>

            <NotificationTable
              token={token}
              refresh={refresh}
              onRefresh={handleRefresh}
            />

            <NotificationCard
              open={openCreateDialog}
              handleClose={handleCloseCreateDialog}
              token={token}
              onSuccess={handleRefresh}
            />
          </>
        ) : (
          <Typography color="error">
            Token not found. Please log in again.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
