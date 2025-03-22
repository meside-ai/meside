ALTER TABLE "warehouse" DROP COLUMN "owner_id";--> statement-breakpoint
ALTER TABLE "warehouse" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_name_unique" UNIQUE("name");