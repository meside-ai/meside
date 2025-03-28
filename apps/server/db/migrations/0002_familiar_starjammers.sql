CREATE TABLE "agent_tool" (
	"agent_tool_id" varchar(128) PRIMARY KEY NOT NULL,
	"agent_id" varchar(128) NOT NULL,
	"tool_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent" (
	"agent_id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"instructions" text NOT NULL,
	"llm_id" varchar(128) NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "agent_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tool" (
	"tool_id" varchar(128) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"provider" jsonb NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3),
	CONSTRAINT "tool_name_unique" UNIQUE("name")
);
