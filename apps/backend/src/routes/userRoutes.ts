import { Router } from "express";
import { verifyUserEmail } from "../controllers/userController";

const router = Router();

router.get("/verify-email/:userId", verifyUserEmail);

export default router;
