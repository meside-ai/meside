CREATE TYPE "public"."message_role" AS ENUM('SYSTEM', 'USER', 'ASSISTANT');--> statement-breakpoint
CREATE TYPE "public"."warehouse_type" AS ENUM('postgresql');--> statement-breakpoint
CREATE TABLE "column" (
	"column_id" varchar(128) PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(128) NOT NULL,
	"table_name" text NOT NULL,
	"column_name" text NOT NULL,
	"column_type" text NOT NULL,
	"description" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "message" (
	"message_id" varchar(128) PRIMARY KEY NOT NULL,
	"thread_id" varchar(128) NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"message_role" "message_role" NOT NULL,
	"structure" json NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
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
	"parent_message_id" varchar(128),
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"name" text NOT NULL,
	"icon" text,
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
	"owner_id" text NOT NULL,
	"org_id" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3)
);
--> statement-breakpoint
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_owner_id_user_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_org_id_org_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."org"("org_id") ON DELETE no action ON UPDATE no action;