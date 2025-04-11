CREATE TABLE "catalog" (
	"catalog_id" varchar(128) PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(128) NOT NULL,
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
CREATE TABLE "query" (
	"query_id" varchar(128) PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(128) NOT NULL,
	"sql" text NOT NULL,
	"fields" jsonb NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "relation" (
	"relation_id" varchar(128) PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(128) NOT NULL,
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
	"provider" jsonb NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
