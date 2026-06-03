import { Router } from "express";
import productController from "../controllers/productController.js";
import { authenticate } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/role.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { validateBody, validateQuery, validateParams } from "../validators/middleware.js";
import { createProductSchema, updateProductSchema, productQuerySchema, uuidParamSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", authenticate, adminOnly, validateBody(createProductSchema), asyncHandler(productController.create));
router.get("/", validateQuery(productQuerySchema), asyncHandler(productController.getAll));
router.get("/:id", validateParams(uuidParamSchema), asyncHandler(productController.getById));
router.put("/:id", authenticate, adminOnly, validateParams(uuidParamSchema), validateBody(updateProductSchema), asyncHandler(productController.update));
router.delete("/:id", authenticate, adminOnly, validateParams(uuidParamSchema), asyncHandler(productController.delete));

export default router;