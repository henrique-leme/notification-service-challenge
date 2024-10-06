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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Account Not Verified</DialogTitle>
      <DialogContent>
        <Typography>
          Your account has not been verified. Please check your email to verify
          your account.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onResendVerification} color="primary">
          Resend Verification Email
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
