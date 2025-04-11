ALTER TABLE "catalog" DROP CONSTRAINT "catalog_full_name_unique";--> statement-breakpoint
ALTER TABLE "relation" DROP CONSTRAINT "relation_full_name_foreign_full_name_unique";--> statement-breakpoint
ALTER TABLE "query" ADD COLUMN "org_id" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "query" ADD COLUMN "owner_id" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouse" ADD COLUMN "owner_id" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouse" ADD COLUMN "org_id" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_org_id_warehouse_id_full_name_unique" UNIQUE("org_id","warehouse_id","full_name");--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_org_id_warehouse_id_catalog_full_name_unique" UNIQUE("org_id","warehouse_id","catalog_full_name");--> statement-breakpoint
ALTER TABLE "relation" ADD CONSTRAINT "relation_org_id_warehouse_id_full_name_foreign_full_name_unique" UNIQUE("org_id","warehouse_id","full_name","foreign_full_name");--> statement-breakpoint
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_org_id_name_unique" UNIQUE("org_id","name");