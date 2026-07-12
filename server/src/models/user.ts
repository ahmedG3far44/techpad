import mongoose, { Schema, Document } from "mongoose";
import { IAddress } from "../utils/types";

enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  isAdmin: boolean;
  status: UserStatus;
  addresses: IAddress[];
}

const addressSchema = new Schema<IAddress>(
  {
    label: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },
    isDefault: { type: Boolean, default: false },
    street: { type: String, default: "" },
    building: { type: String, default: "" },
    floor: { type: String, default: "" },
    apartment: { type: String, default: "" },
    area: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "Egypt" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      required: true,
      default: UserStatus.ACTIVE,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
