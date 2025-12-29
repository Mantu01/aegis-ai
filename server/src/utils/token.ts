import jwt from "jsonwebtoken";
import { Response } from "express";

export const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  });
};

export const setToken = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const removeToken = (res: Response): void => {
  res.clearCookie("token");
};
