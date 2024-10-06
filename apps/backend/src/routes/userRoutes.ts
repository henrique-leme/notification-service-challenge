import { Router } from "express";
import {
  resendVerificationUserEmail,
  verifyUserEmail,
} from "../controllers/userController";

const router = Router();

router.get("/verify-email/:userId", verifyUserEmail);

router.post("/resend-verification", resendVerificationUserEmail);

export default router;
