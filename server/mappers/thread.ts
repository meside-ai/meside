import type { ThreadDto } from "@/api/thread.schema";
import type { ThreadEntity } from "@/db/schema/thread";

export const getThreadDtos = async (
  threads: ThreadEntity[],
): Promise<ThreadDto[]> => {
  return threads;
};
