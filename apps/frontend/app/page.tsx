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

  // Retrieve token on client-side
  useEffect(() => {
    setLoadingToken(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoadingToken(false);
  }, []);

  const handleEdit = (id: string) => {
    console.log(`Editing notification with id: ${id}`);
    // Implement editing functionality here
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // Trigger refresh after creating a notification
  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
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
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h1">
                Suas Notificações
              </Typography>
              <Button variant="contained" onClick={handleOpenCreateDialog}>
                Criar Notificação
              </Button>
            </Box>

            <NotificationTable
              token={token}
              handleEdit={handleEdit}
              refresh={refresh}
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
            Token não encontrado. Por favor, faça login novamente.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
