import { Router } from "express";
import {
  addNotification,
  listNotifications,
  removeNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protect, addNotification);

router.get("/", protect, listNotifications);

router.delete("/:notificationId", protect, removeNotification);

export default router;
