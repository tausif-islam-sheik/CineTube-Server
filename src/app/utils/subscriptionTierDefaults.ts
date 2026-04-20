import { prisma } from "../lib/prisma";

const DEFAULT_SUBSCRIPTION_TIERS: any[] = [
  {
    name: "FREE",
    displayName: "Free Tier",
    description: "Basic access with ads",
    price: 0,
    billingCycle: 1,
    currency: "USD",
    features: ["720p HD", "Ad-supported", "1 device"],
  },
  {
    name: "PREMIUM",
    displayName: "Monthly Premium",
    description: "Full access, zero ads",
    price: 9.99,
    billingCycle: 1,
    currency: "USD",
    features: ["4K Ultra HD", "Zero Ads", "Download movies", "3 devices"],
  },
  {
    name: "VIP",
    displayName: "Yearly VIP",
    description: "Best value, early access",
    price: 79.99,
    billingCycle: 12,
    currency: "USD",
    features: ["All Premium Features", "Save 33%", "Early Access", "Priority Support"],
  },
];

/**
 * Ensures FREE / PREMIUM / VIP tiers exist (local dev often skips `pnpm seed:tiers`).
 */
export async function upsertDefaultSubscriptionTiers() {
  for (const tier of DEFAULT_SUBSCRIPTION_TIERS) {
    await prisma.subscriptionTier.upsert({
      where: { name: tier.name as "FREE" | "PREMIUM" | "VIP" },
      update: {
        displayName: tier.displayName,
        description: tier.description,
        price: tier.price,
        billingCycle: tier.billingCycle,
        currency: tier.currency,
        features: tier.features,
      },
      create: tier,
    });
  }
}
