CREATE TYPE "public"."status" AS ENUM('idle', 'active', 'closed');--> statement-breakpoint
CREATE TABLE "org" (
	"org_id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "thread" (
	"thread_id" varchar(128) PRIMARY KEY NOT NULL,
	"version_id" varchar(128) NOT NULL,
	"active_version" boolean DEFAULT false NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"short_name" text DEFAULT 'question' NOT NULL,
	"system_prompt" text DEFAULT '' NOT NULL,
	"user_prompt" text DEFAULT '' NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "status" DEFAULT 'idle' NOT NULL,
	"parent_thread_id" varchar(128),
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "usage" (
	"usage_id" varchar(128) PRIMARY KEY NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text,
	"email" text,
	"avatar" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
