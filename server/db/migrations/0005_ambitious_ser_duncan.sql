CREATE TABLE "catalog" (
	"catalog_id" varchar(128) PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(128) NOT NULL,
	"warehouse_type" "warehouse_type" NOT NULL,
	"full_name" text NOT NULL,
	"schema_name" text NOT NULL,
	"table_name" text NOT NULL,
	"column_name" text NOT NULL,
	"column_type" text NOT NULL,
	"description" text,
	"org_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "catalog_full_name_unique" UNIQUE("full_name")
);
--> statement-breakpoint
CREATE TABLE "relation" (
	"relation_id" varchar(128) PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(128) NOT NULL,
	"warehouse_type" "warehouse_type" NOT NULL,
	"full_name" text NOT NULL,
	"schema_name" text NOT NULL,
	"table_name" text NOT NULL,
	"column_name" text NOT NULL,
	"foreign_full_name" text NOT NULL,
	"foreign_schema_name" text NOT NULL,
	"foreign_table_name" text NOT NULL,
	"foreign_column_name" text NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "relation_full_name_foreign_full_name_unique" UNIQUE("full_name","foreign_full_name")
);
--> statement-breakpoint
ALTER TABLE "warehouse" DROP CONSTRAINT "warehouse_owner_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "warehouse" DROP CONSTRAINT "warehouse_org_id_org_org_id_fk";
--> statement-breakpoint
ALTER TABLE "warehouse" ALTER COLUMN "owner_id" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "warehouse" ALTER COLUMN "org_id" SET DATA TYPE varchar(128);