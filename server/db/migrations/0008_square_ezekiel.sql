ALTER TABLE "message" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "thread" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "message" CASCADE;--> statement-breakpoint
DROP TABLE "thread" CASCADE;--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "assistant_reason" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "assistant_content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "payload" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "usage" ADD COLUMN "payload" jsonb;--> statement-breakpoint
ALTER TABLE "usage" DROP COLUMN "message_id";--> statement-breakpoint
ALTER TABLE "usage" DROP COLUMN "structure_type";--> statement-breakpoint
DROP TYPE "public"."message_role";