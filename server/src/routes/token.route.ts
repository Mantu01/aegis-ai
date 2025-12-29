import { Router } from "express";
import {createToken,getTokens,getTokenById,deleteToken,updateToken,} from "../controllers/token.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);
router.post("/", createToken);
router.get("/", getTokens);
router.get("/:id", getTokenById);
router.put("/:id", updateToken);
router.delete("/:id", deleteToken);

export default router;
