CREATE TYPE "public"."assistant_status" AS ENUM('none', 'pending', 'success', 'error');
ALTER TABLE "question" ADD COLUMN "assistant_status" "assistant_status" DEFAULT 'none' NOT NULL;