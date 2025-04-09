ALTER TABLE "llm" DROP CONSTRAINT "llm_name_unique";--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_name_unique";--> statement-breakpoint
ALTER TABLE "tool" DROP CONSTRAINT "tool_name_unique";--> statement-breakpoint
DROP INDEX "name_org_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "agent_unique" ON "agent" USING btree ("name","org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "llm_unique" ON "llm" USING btree ("name","org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "team_unique" ON "team" USING btree ("name","org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tool_unique" ON "tool" USING btree ("name","org_id");