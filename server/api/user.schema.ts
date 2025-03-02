import { userEntitySchema } from "@/db/schema/user";
import type { z } from "zod";

export const userDtoSchema = userEntitySchema.pick({
  userId: true,
  name: true,
  avatar: true,
});

export type UserDto = z.infer<typeof userDtoSchema>;
