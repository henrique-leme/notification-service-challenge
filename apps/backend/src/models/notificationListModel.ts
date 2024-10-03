import mongoose, { Document, Schema } from "mongoose";

export interface INotificationList extends Document {
  creator: mongoose.Types.ObjectId;
  receivers: string[];
  searchQuery: string;
  relevancyScore: number;
  frequency: string;
  days: string[];
  time: string;
  timezone: string;
}

export interface INotificationListModel extends INotificationList {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

const notificationListSchema: Schema = new Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivers: [{ type: String, required: true }],
    searchQuery: { type: String, required: true },
    relevancyScore: { type: Number, required: true, min: 1, max: 5 },
    frequency: { type: String, required: true },
    days: [{ type: String, required: true }],
    time: { type: String, required: true },
    timezone: { type: String, default: "UTC" },
  },
  { timestamps: true }
);

const NotificationList = mongoose.model<INotificationListModel>(
  "NotificationList",
  notificationListSchema
);

export default NotificationList;
