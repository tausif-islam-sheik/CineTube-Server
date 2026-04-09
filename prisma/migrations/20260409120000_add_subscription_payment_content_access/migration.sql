-- CreateEnum - Skip if already exists
DO $$ BEGIN
 CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'SSLCOMMERZ', 'WALLET');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAUSED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "SubscriptionTierName" AS ENUM ('FREE', 'STANDARD', 'PREMIUM', 'VIP');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "AccessType" AS ENUM ('RENTAL', 'STREAMING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- CreateTable SubscriptionTier
CREATE TABLE IF NOT EXISTS "subscription_tiers" (
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
CREATE TABLE IF NOT EXISTS "subscriptions" (
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
CREATE TABLE IF NOT EXISTS "content_access" (
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

-- AlterTable payments - Add missing columns if they don't exist
DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "subscription_id" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "paymentMethod" "PaymentMethod";
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "gateway" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "transaction_id" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "failure_reason" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payments" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- AlterTable movies - Add missing columns if they don't exist
DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "slug" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "language" TEXT[] DEFAULT ARRAY['English'];
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "poster_url" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "trailer_url" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "duration" INTEGER;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "average_rating" DOUBLE PRECISION DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "deleted_at" TIMESTAMP(3);
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "movies" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- CreateIndexes - Skip if they already exist
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_tiers_name_key" ON "subscription_tiers"("name");
CREATE INDEX IF NOT EXISTS "subscription_tiers_name_idx" ON "subscription_tiers"("name");

CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_user_id_key" ON "subscriptions"("user_id");
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions"("user_id");
CREATE INDEX IF NOT EXISTS "subscriptions_tier_id_idx" ON "subscriptions"("tier_id");
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions"("status");

CREATE UNIQUE INDEX IF NOT EXISTS "content_access_user_id_movie_id_accessType_key" ON "content_access"("user_id", "movie_id", "accessType");
CREATE INDEX IF NOT EXISTS "content_access_user_id_idx" ON "content_access"("user_id");
CREATE INDEX IF NOT EXISTS "content_access_movie_id_idx" ON "content_access"("movie_id");
CREATE INDEX IF NOT EXISTS "content_access_expires_at_idx" ON "content_access"("expires_at");

CREATE INDEX IF NOT EXISTS "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX IF NOT EXISTS "payments_subscription_id_idx" ON "payments"("subscription_id");
CREATE INDEX IF NOT EXISTS "payments_transaction_id_idx" ON "payments"("transaction_id");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");

CREATE INDEX IF NOT EXISTS "movies_pricing_idx" ON "movies"("pricing");
CREATE INDEX IF NOT EXISTS "movies_title_idx" ON "movies"("title");
CREATE INDEX IF NOT EXISTS "movies_release_year_idx" ON "movies"("release_year");

-- AddForeignKeys - Create if they don't exist
DO $$ 
BEGIN
    ALTER TABLE "subscriptions"
        ADD CONSTRAINT "subscriptions_user_id_fkey" 
        FOREIGN KEY ("user_id") 
        REFERENCES "user"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    ALTER TABLE "subscriptions"
        ADD CONSTRAINT "subscriptions_tier_id_fkey" 
        FOREIGN KEY ("tier_id") 
        REFERENCES "subscription_tiers"("id") 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    ALTER TABLE "payments"
        ADD CONSTRAINT "payments_subscription_id_fkey" 
        FOREIGN KEY ("subscription_id") 
        REFERENCES "subscriptions"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    ALTER TABLE "content_access"
        ADD CONSTRAINT "content_access_user_id_fkey" 
        FOREIGN KEY ("user_id") 
        REFERENCES "user"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    ALTER TABLE "content_access"
        ADD CONSTRAINT "content_access_movie_id_fkey" 
        FOREIGN KEY ("movie_id") 
        REFERENCES "movies"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
