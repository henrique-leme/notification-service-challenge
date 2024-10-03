import { useState } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { resendVerificationEmail } from "../../api/users";

export default function EmailVerificationCard({ email }: { email: string }) {
  const [sent, setSent] = useState(false);

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail(email);
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "2rem auto", padding: "1rem" }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Verifique seu Email
        </Typography>
        <Typography variant="body2" align="center">
          Um email de verificação foi enviado para <strong>{email}</strong>. Por
          favor, verifique sua caixa de entrada para continuar.
        </Typography>
        {!sent ? (
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleResendEmail}
          >
            Reenviar Email
          </Button>
        ) : (
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Email reenviado com sucesso!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
