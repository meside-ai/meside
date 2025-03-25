CREATE TABLE "llm" (
	"llm_id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"provider" jsonb NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "llm_name_unique" UNIQUE("name")
);
