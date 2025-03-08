CREATE TABLE "question" (
	"question_id" varchar(128) PRIMARY KEY NOT NULL,
	"version_id" varchar(128) NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"short_name" text DEFAULT 'question' NOT NULL,
	"user_content" text DEFAULT '' NOT NULL,
	"assistant_reason" text,
	"assistant_content" text,
	"payload" jsonb,
	"parent_question_id" varchar(128),
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
