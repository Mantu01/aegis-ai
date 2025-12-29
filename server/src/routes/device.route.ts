import { Router } from "express";
import {
  getDevices,
  getDeviceById,
  getDeviceDetails,
  createDevice,
  updateDevice,
  deleteDevice
} from "../controllers/device.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getDevices);
router.get("/:id", getDeviceById);
router.get("/:id/details", getDeviceDetails);
router.post("/", createDevice);
router.put("/:id", updateDevice);
router.delete("/:id", deleteDevice);

export default router;

