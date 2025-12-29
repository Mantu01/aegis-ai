import { Request, Response } from "express";
import Device from "../models/device.model.js";
import Token from "../models/token.model.js";

// Get dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    // Get all devices for the user
    const devices = await Device.find({ user: userId });
    
    // Calculate stats
    const totalDevices = devices.length;
    const totalScreenTime = devices.reduce((acc, device) => acc + device.totalScreenTime, 0);
    const averageRiskScore = devices.length > 0
      ? Math.round(devices.reduce((acc, device) => acc + device.riskScore, 0) / devices.length)
      : 0;

    // Format screen time
    const hours = Math.floor(totalScreenTime / 60);
    const minutes = totalScreenTime % 60;
    const formattedScreenTime = `${hours}h ${minutes}m`;

    res.json({
      totalDevices,
      totalScreenTime: formattedScreenTime,
      averageRiskScore
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all devices for dashboard
export const getDashboardDevices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const devices = await Device.find({ user: userId })
      .sort({ lastActive: -1 });

    const formattedDevices = devices.map(device => ({
      id: device._id.toString(),
      name: device.name,
      riskScore: device.riskScore,
      lastActive: formatDate(device.lastActive),
      isActive: device.isActive
    }));

    res.json(formattedDevices);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Helper function
function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

