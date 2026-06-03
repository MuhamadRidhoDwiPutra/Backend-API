import { Prisma } from "@prisma/client";
import prisma from "../config/database.js";
import type {
  ICreateProduct,
  IUpdateProduct,
  IPaginatedResult,
  IProduct,
} from "../types/index.js";

const productRepository = {
  async create(data: ICreateProduct): Promise<Prisma.ProductGetPayload<{}>> {
    return prisma.product.create({ data });
  },

  async findById(id: string): Promise<Prisma.ProductGetPayload<{}> | null> {
    return prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
  },

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<IPaginatedResult<Prisma.ProductGetPayload<{}>>> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async update(
    id: string,
    data: IUpdateProduct
  ): Promise<Prisma.ProductGetPayload<{}>> {
    return prisma.product.update({ where: { id }, data });
  },

  async softDelete(id: string): Promise<Prisma.ProductGetPayload<{}>> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async exists(id: string): Promise<boolean> {
    const count = await prisma.product.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  },

  async findByIds(ids: string[]): Promise<Prisma.ProductGetPayload<{}>[]> {
    return prisma.product.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
  },
};

export default productRepository;