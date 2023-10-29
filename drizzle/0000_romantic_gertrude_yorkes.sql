DO $$ BEGIN
 CREATE TYPE "roles" AS ENUM('default', 'admin', 'superadmin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "subscription_categories" AS ENUM('Other', 'Youtube', 'Spotify', 'Deposit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" "subscription_categories" DEFAULT 'Other' NOT NULL,
	"cost" integer NOT NULL,
	"date" timestamp NOT NULL,
	CONSTRAINT "subscriptions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temp_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" text NOT NULL,
	"token" text NOT NULL,
	"valid_until" timestamp NOT NULL,
	CONSTRAINT "temp_tokens_id_unique" UNIQUE("id"),
	CONSTRAINT "temp_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" text NOT NULL,
	"title" text NOT NULL,
	"category" "subscription_categories" DEFAULT 'Other' NOT NULL,
	"suma" integer NOT NULL,
	"date" timestamp NOT NULL,
	CONSTRAINT "transactions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
	"user_id" text,
	"subscription_id" text,
	CONSTRAINT user_subscriptions_user_id_subscription_id PRIMARY KEY("user_id","subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "roles" DEFAULT 'default' NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"payment_link" text,
	"telegram_id" text,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_telegram_id_unique" UNIQUE("telegram_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "temp_tokens" ADD CONSTRAINT "temp_tokens_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
