import UserModel from "../models/user.schema.ts";
import { TUser } from "@repo/types/src/User";
import HttpError from "../global/error/http.error.ts";

const UserRepository = (): TUserRepository => {
  const create = async (
    username: string,
    password: string,
    nickname: string,
    avatar?: string,
  ): Promise<void> => {
    const user = new UserModel({
      username,
      password,
      nickname,
      avatar,
    });

    await user.save();
  };

  const findByUsernameWithPassword = async (
    username: string,
  ): Promise<TUser & { password: string }> => {
    const user = await UserModel.findOne({
      username: username,
    });
    if (!user) {
      throw new HttpError(404, "User Not Found");
    }

    return {
      id: user._id.toString(),
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      password: user.password,
    };
  };

  return {
    create,
    findByUsernameWithPassword,
  };
};

export default UserRepository;

type TUserRepository = {
  create: (
    username: string,
    password: string,
    nickname: string,
    avatar?: string,
  ) => Promise<void>;

  findByUsernameWithPassword: (
    username: string,
  ) => Promise<TUser & { password: string }>;
};
