ALTER TABLE "warehouse" ADD COLUMN "provider" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "catalog" DROP COLUMN "warehouse_type";--> statement-breakpoint
ALTER TABLE "query" DROP COLUMN "warehouse_type";--> statement-breakpoint
ALTER TABLE "relation" DROP COLUMN "warehouse_type";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "warehouse_type";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "host";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "port";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "database";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "schema";--> statement-breakpoint
DROP TYPE "public"."warehouse_type";