import { Router } from "express";
import {
  getDashboardStats,
  getDashboardDevices
} from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/stats", getDashboardStats);
router.get("/devices", getDashboardDevices);

export default router;


