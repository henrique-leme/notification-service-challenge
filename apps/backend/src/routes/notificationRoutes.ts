import { Router } from "express";
import {
  addNotification,
  listNotifications,
  removeNotification,
  updateNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protect, addNotification);

router.get("/", protect, listNotifications);

router.delete("/:notificationId", protect, removeNotification);

router.put("/:notificationId", protect, updateNotification);

export default router;
