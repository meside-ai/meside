import type { UserDto } from "@/api/user.schema";
import type { UserEntity } from "@/db/schema/user";

export const getUserDtos = async (users: UserEntity[]): Promise<UserDto[]> => {
  return users.map((user) => ({
    userId: user.userId,
    name: user.name,
    avatar: user.avatar,
  }));
};
