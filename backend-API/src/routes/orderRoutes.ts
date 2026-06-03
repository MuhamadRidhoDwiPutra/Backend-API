import { Router } from "express";
import orderController from "../controllers/orderController.js";
import { authenticate } from "../middlewares/auth.js";
import { adminOnly, authenticated } from "../middlewares/role.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { validateBody, validateParams } from "../validators/middleware.js";
import { createOrderSchema, uuidParamSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", authenticate, authenticated, validateBody(createOrderSchema), asyncHandler(orderController.create));
router.get("/history", authenticate, asyncHandler(orderController.getHistory));
router.get("/:id", authenticate, validateParams(uuidParamSchema), asyncHandler(orderController.getById));
router.patch("/:id/status", authenticate, adminOnly, validateParams(uuidParamSchema), asyncHandler(orderController.updateStatus));

export default router;