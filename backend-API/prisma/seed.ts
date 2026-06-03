import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create customer user
  const customerPassword = await bcrypt.hash("Customer123!", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "John Customer",
      email: "customer@example.com",
      password: customerPassword,
      role: Role.CUSTOMER,
    },
  });
  console.log(`✅ Customer created: ${customer.email}`);

  // Create sample products
  const products = [
    { name: "Laptop Gaming Pro", description: "High-performance gaming laptop", price: 2499.99, stock: 50 },
    { name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 49.99, stock: 200 },
    { name: "Mechanical Keyboard", description: "Cherry MX Blue switches", price: 129.99, stock: 150 },
    { name: "USB-C Hub", description: "7-in-1 USB-C hub", price: 39.99, stock: 300 },
    { name: "Monitor 27-inch 4K", description: "4K IPS monitor", price: 599.99, stock: 75 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: product,
    });
  }
  console.log(`✅ Created ${products.length} sample products`);

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });