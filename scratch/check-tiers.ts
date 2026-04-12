import { prisma } from '../src/app/lib/prisma';

async function main() {
  const tiers = await prisma.subscriptionTier.findMany();
  console.log(JSON.stringify(tiers, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
