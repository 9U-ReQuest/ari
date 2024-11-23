import { Schema, model, Types } from "mongoose";

type TUserSchema = {
  username: string;
  password: string;
  nickname: string;
  avatar: string;
};

const UserSchema = new Schema<TUserSchema>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true, unique: true },
    avatar: { type: String },
  },
  { timestamps: true },
);

const UserModel = model<TUserSchema>("User", UserSchema);

export default UserModel;
