CREATE TABLE "usage" (
	"usage_id" varchar(128) PRIMARY KEY NOT NULL,
	"message_id" varchar(128) NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"model_name" text NOT NULL,
	"input_token" integer NOT NULL,
	"output_token" integer NOT NULL,
	"finish_reason" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
