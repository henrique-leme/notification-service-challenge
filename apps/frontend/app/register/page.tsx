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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { registerUser } from "../../api/auth";

export default function RegistrationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openModal, setOpenModal] = useState(false);

  const schema = z
    .object({
      firstName: z.string({ required_error: "First name is required" }),
      lastName: z.string().optional(),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      confirmPassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      schema.parse(formData);
      setErrors({});

      await registerUser({
        name: formData.firstName,
        surname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setOpenModal(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path && error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: "Error registering user" });
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    router.push("/login");
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
          Register
        </Typography>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            error={!!errors.firstName}
            helperText={errors.firstName}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            error={!!errors.lastName}
            helperText={errors.lastName}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={!!errors.email}
            helperText={errors.email}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={!!errors.password}
            helperText={errors.password}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
            Register
          </Button>
        </Box>
      </Paper>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <Typography>
            Thank you for registering! Please check your email to confirm your
            account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
