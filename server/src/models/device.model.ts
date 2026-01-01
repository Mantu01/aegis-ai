import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./user.model.js";
import { IToken } from "./token.model.js";

export interface IDevice extends Document {
  name: string;
  type: string;
  riskScore: number;
  lastActive: Date;
  totalScreenTime: number; // in minutes
  osVersion: string;
  batteryLevel: number;
  isActive: boolean;
  connectionType: string;
  owner: string;
  user: Types.ObjectId | IUser;
  token: Types.ObjectId | IToken;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    riskScore: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    totalScreenTime: {
      type: Number,
      default: 0,
      min: 0
    },
    osVersion: {
      type: String,
      trim: true
    },
    batteryLevel: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    isActive: {
      type: Boolean,
      default: true
    },
    connectionType: {
      type: String,
      enum: ["Wi-Fi", "Cellular", "Ethernet", "Unknown"],
      default: "Unknown"
    },
    owner: {
      type: String,
      trim: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    token: {
      type: Schema.Types.ObjectId,
      ref: "Token",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Device: Model<IDevice> = mongoose.models.Device || mongoose.model<IDevice>("Device", deviceSchema);

export default Device;


