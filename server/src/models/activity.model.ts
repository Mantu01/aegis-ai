import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IDevice } from "./device.model.js";

export interface IActivity extends Document {
  time: Date;
  action: string;
  riskLevel: "low" | "medium" | "high";
  details: string;
  device: Types.ObjectId | IDevice;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    time: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>("Activity", activitySchema);

export default Activity;

