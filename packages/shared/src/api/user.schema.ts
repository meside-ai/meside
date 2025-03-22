import { z } from "zod";

export const userDtoSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
