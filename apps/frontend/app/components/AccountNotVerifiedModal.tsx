import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface AccountNotVerifiedModalProps {
  open: boolean;
  onClose: () => void;
  onResendVerification: () => void;
}

export default function AccountNotVerifiedModal({
  open,
  onClose,
  onResendVerification,
}: AccountNotVerifiedModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Account Not Verified</DialogTitle>
      <DialogContent>
        <Typography>
          Your account has not been verified. Please check your email to verify
          your account.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          onClick={onResendVerification}
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
          Resend Verification Email
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          size="large"
          sx={{
            backgroundColor: "#555",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#777",
            },
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
