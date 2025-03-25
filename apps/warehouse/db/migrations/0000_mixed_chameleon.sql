CREATE TYPE "public"."warehouse_type" AS ENUM('postgresql', 'bigquery', 'mysql', 'oracle');--> statement-breakpoint
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
CREATE TABLE "label" (
	"label_id" varchar(128) PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(128) NOT NULL,
	"catalog_full_name" text NOT NULL,
	"json_label" text,
	"org_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
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
CREATE TABLE "warehouse" (
	"warehouse_id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"warehouse_type" "warehouse_type" NOT NULL,
	"host" text NOT NULL,
	"port" integer NOT NULL,
	"database" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"schema" text,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
