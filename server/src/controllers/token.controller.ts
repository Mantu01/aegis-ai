import { Request, Response } from "express";
import Token from "../models/token.model.js";
import Device from "../models/device.model.js";

// Generate a random token string
function generateTokenString(): string {
  const prefix = "aegis_sk_";
  const randomPart1 = Math.random().toString(36).substring(2, 18);
  const randomPart2 = Math.random().toString(36).substring(2, 10);
  return `${prefix}${randomPart1}_${randomPart2}`;
}

export const createToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { expiryInDays } = req.body;

    if (!expiryInDays || parseInt(expiryInDays) <= 0) {
      return res.status(400).json({ message: "Valid expiryInDays is required" });
    }

    // Generate unique token
    let tokenString = generateTokenString();
    let tokenExists = await Token.findOne({ token: tokenString });
    
    // Ensure uniqueness
    while (tokenExists) {
      tokenString = generateTokenString();
      tokenExists = await Token.findOne({ token: tokenString });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(expiryInDays));

    const newToken = await Token.create({
      token: tokenString,
      user: userId,
      expiry: expiryDate,
      isActive: true
    });

    // Format response to match UI expectations
    const formattedToken = {
      id: newToken._id.toString(),
      token: newToken.token,
      isActive: newToken.isActive,
      hasDeviceConnected: false,
      expiresAt: newToken.expiry.toISOString().split('T')[0],
      createdAt: newToken.createdAt.toISOString().split('T')[0]
    };

    res.status(201).json(formattedToken);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tokens for the authenticated user
export const getTokens = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const tokens = await Token.find({ user: userId })
      .sort({ createdAt: -1 });

    // Check if each token has a connected device
    const tokensWithDeviceStatus = await Promise.all(
      tokens.map(async (token) => {
        const deviceCount = await Device.countDocuments({ token: token._id });
        return {
          id: token._id.toString(),
          token: token.token,
          isActive: token.isActive,
          hasDeviceConnected: deviceCount > 0,
          expiresAt: token.expiry.toISOString().split('T')[0],
          createdAt: token.createdAt.toISOString().split('T')[0]
        };
      })
    );

    res.json(tokensWithDeviceStatus);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a token by ID
export const getTokenById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const token = await Token.findOne({ _id: req.params.id, user: userId })
      .populate("user", "-password")
      .populate("childContentStats");

    if (!token) return res.status(404).json({ message: "Token not found" });
    
    const deviceCount = await Device.countDocuments({ token: token._id });
    const formattedToken = {
      id: token._id.toString(),
      token: token.token,
      isActive: token.isActive,
      hasDeviceConnected: deviceCount > 0,
      expiresAt: token.expiry.toISOString().split('T')[0],
      createdAt: token.createdAt.toISOString().split('T')[0]
    };
    
    res.json(formattedToken);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a token
export const deleteToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const token = await Token.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!token) return res.status(404).json({ message: "Token not found" });
    
    // Also delete associated devices
    await Device.deleteMany({ token: req.params.id });
    
    res.json({ message: "Token deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: Update token (like extend expiry or toggle active status)
export const updateToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { deviceName, expiryInDays, isActive } = req.body;

    const token = await Token.findOne({ _id: req.params.id, user: userId });
    if (!token) return res.status(404).json({ message: "Token not found" });

    if (deviceName) token.deviceName = deviceName;
    if (expiryInDays) {
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + Number(expiryInDays));
      token.expiry = newExpiry;
    }
    if (isActive !== undefined) token.isActive = isActive;

    await token.save();
    
    const deviceCount = await Device.countDocuments({ token: token._id });
    const formattedToken = {
      id: token._id.toString(),
      token: token.token,
      isActive: token.isActive,
      hasDeviceConnected: deviceCount > 0,
      expiresAt: token.expiry.toISOString().split('T')[0],
      createdAt: token.createdAt.toISOString().split('T')[0]
    };
    
    res.json(formattedToken);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
