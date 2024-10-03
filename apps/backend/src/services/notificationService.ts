import mongoose from "mongoose";
import NotificationList from "../models/notificationListModel";
import User from "../models/userModel";
import { sendNotificationEmail } from "./emailService";

export const createNotification = async (
  userId: string,
  receivers: string[],
  searchQuery: string,
  relevancyScore: number,
  frequency: string,
  days: string[],
  time: string,
  timezone: string
) => {
  const user = await User.findById(userId);
  const username = await User.findOne({ _id: userId });
  if (!user) throw new Error("User not found.");

  const newNotification = new NotificationList({
    creator: user._id,
    receivers,
    searchQuery,
    relevancyScore,
    frequency,
    days,
    time,
    timezone,
  });

  await newNotification.save();

  user.notificationList.push(newNotification._id as mongoose.Types.ObjectId);
  await user.save();

  const candidateName = username?.get("name");
  const emailContent = `Hello!

This is ${candidateName}. You've requested notifications about "${searchQuery}".
With Frequency: ${frequency}, Timezone: ${timezone}.
Have a great day,

${candidateName}`;

  try {
    await sendNotificationEmail(receivers, emailContent);
  } catch (error) {
    console.error("Error sending email:", error);
  }

  return newNotification;
};

export const getNotifications = async (userId: string) => {
  const notifications = await NotificationList.find({ creator: userId });
  if (!notifications.length) throw new Error("No notifications found.");

  return notifications;
};

export const deleteNotification = async (
  userId: string,
  notificationId: string
) => {
  const notification = await NotificationList.findById(notificationId);
  if (!notification) throw new Error("Notification not found.");

  if (notification.creator.toString() !== userId)
    throw new Error("Action not authorized.");

  await NotificationList.findByIdAndDelete(notificationId);
};

export const editNotification = async (
  userId: string,
  notificationId: string,
  updateData: {
    receivers?: string[];
    searchQuery?: string;
    relevancyScore?: number;
    frequency?: string;
    days?: string[];
    time?: string;
    timezone?: string;
  }
) => {
  const notification = await NotificationList.findById(notificationId);
  if (!notification) throw new Error("Notification not found.");

  if (notification.creator.toString() !== userId)
    throw new Error("Action not authorized.");

  Object.assign(notification, updateData);
  await notification.save();

  return notification;
};
