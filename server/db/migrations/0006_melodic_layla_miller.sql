DROP TABLE "column" CASCADE;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "reason" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "text" text DEFAULT '' NOT NULL;