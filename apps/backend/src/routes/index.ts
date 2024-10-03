import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import notificationRoutes from "./notificationRoutes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/notifications", notificationRoutes);

export default router;
