import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { primaryKeyCuid, useTimestamp } from "../../db/utils";

export const orgTable = pgTable("org", {
  orgId: primaryKeyCuid("org_id"),
  name: text("name").notNull(),
  ...useTimestamp(),
});

export const orgEntitySchema = createSelectSchema(orgTable);

export type OrgEntity = z.infer<typeof orgEntitySchema>;
