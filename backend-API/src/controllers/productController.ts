import { Request, Response } from "express";
import productService from "../services/productService.js";
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from "../validators/schemas.js";

const productController = {
  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateProductInput;
    const product = await productService.create({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },

  async getAll(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ProductQueryInput;
    const result = await productService.getAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: result,
    });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await productService.getById(id);

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  },

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body as UpdateProductInput;
    const product = await productService.update(id, {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await productService.delete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  },
};

export default productController;