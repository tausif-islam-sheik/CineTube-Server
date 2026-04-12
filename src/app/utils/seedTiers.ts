import { prisma } from "../lib/prisma";
import { upsertDefaultSubscriptionTiers } from "./subscriptionTierDefaults";

async function seedTiers() {
  console.log("🌱 Seeding Subscription Tiers...");
  await upsertDefaultSubscriptionTiers();
  for (const name of ["FREE", "PREMIUM", "VIP"] as const) {
    console.log(`✅ Seeded tier: ${name}`);
  }
  console.log("🏁 Seeding complete!");
}

seedTiers()
  .catch((e) => {
    console.error("❌ Error seeding tiers:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
