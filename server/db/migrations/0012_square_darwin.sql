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
