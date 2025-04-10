import type { UserDto } from "@meside/shared/api/user.schema";
import type { UserEntity } from "../table/user";

export const getUserDtos = async (users: UserEntity[]): Promise<UserDto[]> => {
  return users.map((user) => ({
    userId: user.userId,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  }));
};
