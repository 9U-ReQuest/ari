import type { TUser } from "@repo/types/src/User";
import UserRepository from "../repositories/user.repository.ts";
import HttpError from "../global/error/http.error.ts";

const UserService = (): TUserService => {
  const signup = async (
    username: string,
    password: string,
    nickname: string,
    avatar?: string,
  ): Promise<void> => {
    const { create } = UserRepository();

    await create(username, password, nickname, avatar);
  };

  const login = async (username: string, password: string): Promise<TUser> => {
    const { findByUsernameWithPassword } = UserRepository();

    const user = await findByUsernameWithPassword(username);
    if (user.password !== password) {
      throw new HttpError(404, "User Not Found");
    }

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
    };
  };

  return {
    signup,
    login,
  };
};

export default UserService;

type TUserService = {
  signup: (
    username: string,
    password: string,
    nickname: string,
    avatar?: string,
  ) => Promise<void>;
  login: (username: string, password: string) => Promise<TUser>;
};
