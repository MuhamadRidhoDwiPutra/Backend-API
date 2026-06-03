import { Prisma } from "@prisma/client";
import prisma from "../../config/database.js";

interface OrderItemData {
  productId: string;
  quantity: number;
  price: number;
}

const orderRepository = {
  async createWithItems(
    userId: string,
    items: OrderItemData[],
    totalAmount: number
  ): Promise<Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }>> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });
  },

  async findById(
    id: string
  ): Promise<Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }> | null> {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
  },

  async findByIdForUser(
    id: string,
    userId: string
  ): Promise<Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }> | null> {
    return prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } },
    });
  },

  async findByUserId(
    userId: string,
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { orders, total };
  },

  async updateStatus(
    id: string,
    status: "PENDING" | "PAID" | "CANCELLED"
  ): Promise<Prisma.OrderGetPayload<{ include: { items: true } }>> {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  },

  async cancelOrder(id: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) throw new Error("Order not found");

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: { items: true },
      });
    });
  },
};

export default orderRepository;