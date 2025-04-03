CREATE TABLE "org_user" (
	"org_user_id" varchar(128) PRIMARY KEY NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
