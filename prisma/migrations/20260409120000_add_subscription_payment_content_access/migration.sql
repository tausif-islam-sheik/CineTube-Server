-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'SSLCOMMERZ', 'WALLET');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAUSED');

-- CreateEnum
CREATE TYPE "SubscriptionTierName" AS ENUM ('FREE', 'STANDARD', 'PREMIUM', 'VIP');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('RENTAL', 'STREAMING');

-- CreateTable SubscriptionTier
CREATE TABLE "subscription_tiers" (
    "id" TEXT NOT NULL,
    "name" "SubscriptionTierName" NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "billingCycle" INTEGER NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "features" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable Subscription
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tier_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable ContentAccess
CREATE TABLE "content_access" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "accessType" "AccessType" NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_access_pkey" PRIMARY KEY ("id")
);

-- AlterTable payments
ALTER TABLE "payments" ADD COLUMN "subscription_id" TEXT,
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "paymentMethod" "PaymentMethod",
ADD COLUMN "gateway" TEXT,
ADD COLUMN "transaction_id" TEXT,
ADD COLUMN "failure_reason" TEXT,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable movies
ALTER TABLE "movies" 
ADD COLUMN "slug" TEXT,
ADD COLUMN "language" TEXT[] DEFAULT ARRAY['English'],
ADD COLUMN "poster_url" TEXT,
ADD COLUMN "trailer_url" TEXT,
ADD COLUMN "duration" INTEGER,
ADD COLUMN "average_rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_tiers_name_key" ON "subscription_tiers"("name");
CREATE INDEX "subscription_tiers_name_idx" ON "subscription_tiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");
CREATE INDEX "subscriptions_tier_id_idx" ON "subscriptions"("tier_id");
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "content_access_user_id_movie_id_accessType_key" ON "content_access"("user_id", "movie_id", "accessType");
CREATE INDEX "content_access_user_id_idx" ON "content_access"("user_id");
CREATE INDEX "content_access_movie_id_idx" ON "content_access"("movie_id");
CREATE INDEX "content_access_expires_at_idx" ON "content_access"("expires_at");

-- UpdateIndex payments
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");
DROP INDEX "payments_user_id_idx";
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX "payments_subscription_id_idx" ON "payments"("subscription_id");
CREATE INDEX "payments_transaction_id_idx" ON "payments"("transaction_id");
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- UpdateIndex movies
CREATE INDEX "movies_pricing_idx" ON "movies"("pricing");
DROP INDEX "movies_title_idx";
CREATE INDEX "movies_title_idx" ON "movies"("title");
DROP INDEX "movies_releaseYear_idx";
CREATE INDEX "movies_release_year_idx" ON "movies"("release_year");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "subscription_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_access" ADD CONSTRAINT "content_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_access" ADD CONSTRAINT "content_access_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
