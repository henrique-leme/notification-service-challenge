"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Container,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { sendPasswordRecoveryEmail } from "../../api/users";

export default function RecoveryPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please fill in the email field");
      return;
    }

    try {
      const response = await sendPasswordRecoveryEmail(email);

      if (response.message) {
        setSuccess(response.message);
        setError("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send recovery email");
      setSuccess("");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: 400,
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{ position: "absolute", top: 8, left: 8 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
          sx={{ color: "#333", fontWeight: "bold", mt: 2 }}
        >
          Recover Password
        </Typography>

        {/* Exibe a mensagem de erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Exibe a mensagem de sucesso */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRecovery} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "1.5rem" }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#555",
              },
              textTransform: "none",
            }}
          >
            Recover Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
