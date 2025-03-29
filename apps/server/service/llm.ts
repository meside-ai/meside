import { and, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { llmTable } from "../db/schema/llm";

import { firstOrNotFound } from "../utils/toolkit";

export const getActiveLlm = async ({ orgId }: { orgId: string }) => {
  const activeLlm = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(llmTable)
      .where(
        and(
          eq(llmTable.orgId, orgId),
          eq(llmTable.isDefault, true),
          isNull(llmTable.deletedAt),
        ),
      ),
    "Could not find default llm",
  );

  return activeLlm;
};
