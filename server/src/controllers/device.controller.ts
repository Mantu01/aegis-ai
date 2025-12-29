import { Request, Response } from "express";
import Device from "../models/device.model.js";
import Activity from "../models/activity.model.js";
import { ChildContentStats } from "../models/stats.model.js";

// Get all devices for a user
export const getDevices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const devices = await Device.find({ user: userId })
      .populate("token")
      .sort({ lastActive: -1 });
    
    res.json(devices);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get device by ID
export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const device = await Device.findOne({ _id: req.params.id, user: userId })
      .populate("token")
      .populate("user", "-password");
    
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    
    res.json(device);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get device details with stats
export const getDeviceDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const deviceId = req.params.id;
    
    const device = await Device.findOne({ _id: deviceId, user: userId })
      .populate("token")
      .populate("user", "-password");
    
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Get activity logs for the device
    const activities = await Activity.find({ device: deviceId })
      .sort({ time: -1 })
      .limit(50);

    // Get blocked content stats from token's childContentStats
    await device.populate({
      path: "token",
      populate: { path: "childContentStats" }
    });
    
    let blockedContent = [];
    let timeUsage = [];

    if (device.token && typeof device.token === 'object' && 'childContentStats' in device.token) {
      const stats = (device.token as any).childContentStats;
      if (stats) {
        // Transform content types to blocked content format
        blockedContent = stats.contentTypes.map((ct: any) => ({
          category: ct.name,
          count: Math.round(ct.percentage * 4), // Approximate count from percentage
          percentage: ct.percentage
        }));

        // Transform content types to time usage format
        timeUsage = stats.contentTypes.map((ct: any) => ({
          app: ct.name,
          category: ct.name,
          minutes: ct.timeSpent,
          percentage: ct.percentage
        }));
      }
    }

    // Format response
    const response = {
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        riskScore: device.riskScore,
        lastActive: device.lastActive,
        totalScreenTime: formatScreenTime(device.totalScreenTime),
        osVersion: device.osVersion,
        batteryLevel: device.batteryLevel,
        isActive: device.isActive,
        connectionType: device.connectionType,
        owner: device.owner
      },
      blockedContent,
      activityLogs: activities.map(activity => ({
        time: formatTime(activity.time),
        action: activity.action,
        riskLevel: activity.riskLevel,
        details: activity.details
      })),
      timeUsage
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new device
export const createDevice = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, type, tokenId, osVersion, connectionType, owner } = req.body;

    if (!name || !type || !tokenId) {
      return res.status(400).json({ message: "Name, type, and tokenId are required" });
    }

    const device = await Device.create({
      name,
      type,
      token: tokenId,
      user: userId,
      osVersion: osVersion || "Unknown",
      connectionType: connectionType || "Unknown",
      owner: owner || "Unknown",
      riskScore: 0,
      totalScreenTime: 0,
      batteryLevel: 100,
      isActive: true,
      lastActive: new Date()
    });

    res.status(201).json(device);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update device
export const updateDevice = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const device = await Device.findOne({ _id: req.params.id, user: userId });
    
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const { name, type, riskScore, totalScreenTime, osVersion, batteryLevel, isActive, connectionType, owner } = req.body;

    if (name) device.name = name;
    if (type) device.type = type;
    if (riskScore !== undefined) device.riskScore = riskScore;
    if (totalScreenTime !== undefined) device.totalScreenTime = totalScreenTime;
    if (osVersion) device.osVersion = osVersion;
    if (batteryLevel !== undefined) device.batteryLevel = batteryLevel;
    if (isActive !== undefined) device.isActive = isActive;
    if (connectionType) device.connectionType = connectionType;
    if (owner) device.owner = owner;
    
    device.lastActive = new Date();
    await device.save();

    res.json(device);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete device
export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const device = await Device.findOneAndDelete({ _id: req.params.id, user: userId });
    
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Also delete associated activities
    await Activity.deleteMany({ device: req.params.id });

    res.json({ message: "Device deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Helper functions
function formatScreenTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatTime(date: Date): string {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

