import productRepository from "../repositories/productRepository.js";
import { AppError } from "../middlewares/errorHandler.js";
import { decimalToNumber } from "../utils/index.js";
import type { ICreateProduct, IUpdateProduct, IPaginatedResult } from "../types/index.js";
import type { Prisma } from "@prisma/client";

const productService = {
  async create(data: ICreateProduct) {
    return productRepository.create(data);
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return {
      ...product,
      price: decimalToNumber(product.price),
    };
  },

  async getAll(params: { page?: number; limit?: number; search?: string }) {
    const result = await productRepository.findAll(params);
    return {
      data: result.data.map((p) => ({
        ...p,
        price: decimalToNumber(p.price),
      })),
      pagination: result.pagination,
    };
  },

  async update(id: string, data: IUpdateProduct) {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    const product = await productRepository.update(id, data);
    return {
      ...product,
      price: decimalToNumber(product.price),
    };
  },

  async delete(id: string) {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }
    await productRepository.softDelete(id);
  },
};

export default productService;