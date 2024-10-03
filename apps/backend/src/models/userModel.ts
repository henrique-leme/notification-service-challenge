import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  surname?: string;
  email: string;
  password: string;
  isVerified: boolean;
  notificationList: mongoose.Types.ObjectId[];
}

export interface IUserModel extends IUser {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    notificationList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "NotificationList" },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model<IUserModel>("User", userSchema);
export default User;
