import { Prisma } from "@prisma/client";
import prisma from "../config/database.js";
import type { ICreateUser } from "../types/index.js";

const userRepository = {
  async create(data: ICreateUser): Promise<Prisma.UserGetPayload<{}>> {
    return prisma.user.create({ data });
  },

  async findByEmail(email: string): Promise<Prisma.UserGetPayload<{}> | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string): Promise<Prisma.UserGetPayload<{}> | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  },
};

export default userRepository;