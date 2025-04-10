import type { LlmDto } from "@meside/shared/api/llm.schema";
import { inArray } from "drizzle-orm";
import { uniq } from "es-toolkit/compat";
import { getDrizzle } from "../../db/db";
import type { LlmEntity } from "../table/llm";
import { userTable } from "../table/user";
import { getUserDtos } from "./user";

export const getLlmDtos = async (llms: LlmEntity[]): Promise<LlmDto[]> => {
  const userIds = uniq(
    llms.map((llm) => llm.ownerId).filter((ownerId) => ownerId !== null),
  );

  const userDtos = await getUserDtos(
    await getDrizzle()
      .select()
      .from(userTable)
      .where(inArray(userTable.userId, userIds)),
  );

  const llmsDto = llms.map((llm) => {
    const owner = userDtos.find((user) => user.userId === llm.ownerId);

    return {
      ...llm,
      owner,
    } as LlmDto;
  });

  return llmsDto;
};
