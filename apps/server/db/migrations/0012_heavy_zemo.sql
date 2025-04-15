DROP TABLE "agent_tool" CASCADE;--> statement-breakpoint
DROP TABLE "agent" CASCADE;--> statement-breakpoint
DROP TABLE "team_agent" CASCADE;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "orchestration" jsonb NOT NULL;