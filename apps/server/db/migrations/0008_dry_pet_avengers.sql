ALTER TABLE "agent" DROP CONSTRAINT "agent_name_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "name_org_unique" ON "agent" USING btree ("name","org_id");