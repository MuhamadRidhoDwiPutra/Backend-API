import { orderRepository, productRepository } from "../repositories/index.js";
import { AppError } from "../middlewares/errorHandler.js";
import { decimalToNumber } from "../utils/index.js";
import type { IPaginatedResult } from "../types/index.js";
import type { Prisma } from "@prisma/client";

const orderService = {
  async createOrder(userId: string, items: { productId: string; quantity: number }[]) {
    const productIds = items.map((item) => item.productId);
    const products = await productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new AppError("One or more products not found", 400);
    }

    const productMap = new Map(
      products.map((p) => [p.id, { price: decimalToNumber(p.price), stock: decimalToNumber(p.stock) }])
    );

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new AppError(`Product ${item.productId} not found`, 400);

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}`,
          400
        );
      }
    }

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      totalAmount += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    return orderRepository.createWithItems(userId, orderItems, totalAmount);
  },

  async getOrderById(id: string, userId?: string) {
    let order;
    if (userId) {
      order = await orderRepository.findByIdForUser(id, userId);
    } else {
      order = await orderRepository.findById(id);
    }

    if (!order) {
      throw new AppError("Order not found", 404);
    }
    return order;
  },

  async getOrderHistory(userId: string, page = 1, limit = 10) {
    const { orders, total } = await orderRepository.findByUserId(userId, page, limit);
    return {
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async updateOrderStatus(id: string, status: "PENDING" | "PAID" | "CANCELLED") {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status === "CANCELLED" && status !== "CANCELLED") {
      throw new AppError("Cannot change status of cancelled order", 400);
    }

    if (status === "CANCELLED") {
      return orderRepository.cancelOrder(id);
    }

    return orderRepository.updateStatus(id, status);
  },
};

export default orderService;