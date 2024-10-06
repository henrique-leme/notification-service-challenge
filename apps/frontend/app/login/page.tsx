"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../../api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
          Login
        </Typography>
        {error && (
          <Typography
            variant="body2"
            color="error"
            align="center"
            sx={{ marginBottom: "1rem" }}
          >
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{ marginBottom: "1.5rem" }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{ marginBottom: "1rem" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={handleTogglePassword}
                icon={<VisibilityOff />}
                checkedIcon={<Visibility />}
              />
            }
            label="Show Password"
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
            Sign In
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: "center" }}>
          <Link href="/register" variant="body2" sx={{ color: "#333" }}>
            Don’t have an account? <strong>Sign up</strong>
          </Link>
          <br />
          <Link
            href="/recovery-password"
            variant="body2"
            sx={{ color: "#333", mt: 1 }}
          >
            Forgot Password? <strong>Reset it</strong>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
