import { Router } from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { validateBody } from "../validators/middleware.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";

const router = Router();

router.post("/register", validateBody(registerSchema), asyncHandler(authController.register));
router.post("/login", validateBody(loginSchema), asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.getProfile));

export default router;