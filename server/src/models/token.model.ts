import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./user.model.js";
import { IChildContentStats } from "./stats.model.js";

export interface IToken extends Document{
  deviceName:string,
  token:string,
  user:Types.ObjectId | IUser,
  childContentStats:Types.ObjectId | IChildContentStats
  expiry:Date,
  isActive:boolean,
  createdAt:Date,
}

const tokenSchema = new Schema<IToken>(
  {
    deviceName: {
      type: String,
      trim: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    childContentStats:{
      type: Schema.Types.ObjectId,
      ref: "ChildContentStats",
    },
    expiry: {
      type: Date,
      required: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Token:Model<IToken>=mongoose.models.Token || mongoose.model<IToken>('Token',tokenSchema);

export default Token;