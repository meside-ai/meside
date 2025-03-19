import type { UserEntity } from "@/db/schema/user";
import type { UserDto } from "@meside/shared/api/user.schema";

export const getUserDtos = async (users: UserEntity[]): Promise<UserDto[]> => {
  return users.map((user) => ({
    userId: user.userId,
    name: user.name,
    avatar: user.avatar,
  }));
};
