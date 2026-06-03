import userRepository from "../repositories/userRepository.js";
import { hashPassword, comparePassword, generateToken } from "../utils/index.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { ICreateUser, IJwtPayload } from "../types/index.js";
import type { Prisma } from "@prisma/client";

const authService = {
  async register(data: ICreateUser) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const payload: IJwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(payload);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    const payload: IJwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(payload);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken };
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};

export default authService;