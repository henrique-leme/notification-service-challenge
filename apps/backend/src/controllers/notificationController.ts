import { Request, Response } from "express";
import {
  createNotification,
  getNotifications,
  deleteNotification,
} from "../services/notificationService";
import mongoose from "mongoose";

export const addNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    receivers,
    searchQuery,
    relevancyScore,
    frequency,
    days,
    time,
    timezone,
  } = req.body;

  if (!req.user) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }

  const userId = (req.user as { _id: mongoose.Types.ObjectId })._id.toString();

  try {
    const notification = await createNotification(
      userId,
      receivers,
      searchQuery,
      relevancyScore,
      frequency,
      days,
      time,
      timezone
    );
    res
      .status(201)
      .json({ message: "Notificação criada com sucesso", notification });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const listNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }

  const userId = (req.user as { _id: mongoose.Types.ObjectId })._id.toString();

  try {
    const notifications = await getNotifications(userId);
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }

  const userId = (req.user as { _id: mongoose.Types.ObjectId })._id.toString();
  const { notificationId } = req.params;

  try {
    await deleteNotification(userId, notificationId);
    res.status(200).json({ message: "Notificação removida com sucesso." });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
