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
} from "@mui/material";
import { sendPasswordRecoveryEmail } from "../../api/users";

export default function RecoveryPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Preencha o campo de email");
      return;
    }

    try {
      await sendPasswordRecoveryEmail(email);
      setSuccess("Email de recuperação enviado com sucesso");
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
          sx={{ color: "#333", fontWeight: "bold" }}
        >
          Recuperar Senha
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
            Recuperar Senha
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
