import { seedAdmin } from "./app/utils/adminSeed";
import { seedDemoUser } from "./app/utils/demoSeed";
import { prisma } from "./app/lib/prisma";

const main = async () => {
  console.log("🌱 Starting database seeding...");
  
  try {
    await seedAdmin();
    await seedDemoUser();
    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
