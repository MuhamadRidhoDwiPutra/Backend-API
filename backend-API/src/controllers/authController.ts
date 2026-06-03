import { Request, Response } from "express";
import authService from "../services/authService.js";
import type { RegisterInput, LoginInput } from "../validators/schemas.js";

const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const data = req.body as RegisterInput;
    const result = await authService.register({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginInput;
    const result = await authService.login(data.email, data.password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  },

  async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const user = await authService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  },
};

export default authController;