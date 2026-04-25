import { seedAdmin } from "./app/utils/adminSeed";
import { prisma } from "./app/lib/prisma";

const main = async () => {
  console.log("🌱 Starting database seeding...");
  
  try {
    await seedAdmin();
    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
