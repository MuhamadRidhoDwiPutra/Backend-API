import { Request, Response } from "express";
import orderService from "../services/orderService.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { CreateOrderInput } from "../validators/schemas.js";

const orderController = {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const data = req.body as CreateOrderInput;
    const order = await orderService.createOrder(userId, data.items);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id) throw new AppError("Invalid order ID", 400);
    const userId = req.user!.role === "ADMIN" ? undefined : req.user!.userId;
    const order = await orderService.getOrderById(id, userId);

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  },

  async getHistory(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const page = parseInt(req.query["page"] as string, 10) || 1;
    const limit = parseInt(req.query["limit"] as string, 10) || 10;
    const result = await orderService.getOrderHistory(userId, page, limit);

    res.status(200).json({
      success: true,
      message: "Order history retrieved successfully",
      data: result,
    });
  },

  async updateStatus(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id) throw new AppError("Invalid order ID", 400);
    const { status } = req.body as { status: "PENDING" | "PAID" | "CANCELLED" };

    if (!["PENDING", "PAID", "CANCELLED"].includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    const order = await orderService.updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  },
};

export default orderController;