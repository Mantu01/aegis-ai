import { Request, Response } from "express";
import { createToken, removeToken, setToken } from "../utils/token.js";
import User from "../models/user.model.js";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const token = createToken(user._id.toString());
  setToken(res, token);

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = createToken(user._id.toString());
  setToken(res, token);

  res.json({
    id: user._id,
    name: user.name,
    email: user.email
  });
};

export const logout = async (_req: Request, res: Response) => {
  removeToken(res);
  res.json({ message: "Logged out" });
};


export const me = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};