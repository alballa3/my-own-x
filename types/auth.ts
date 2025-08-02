import { IPost } from "./posts";

export interface IUser {
  id: string;
  name: string;
  bio?: string;
  email: string;
  password: string;
  session: session[];
}
export interface session {
  session_id: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}
export interface UserInDB extends IUser {
  created_at: Date | String;
}
export type UserCollection = Record<string, IUser>;

export interface Profile {
  name: string;
  bio?: string;
  created_at: string;
  posts_count: number;
  is_user: boolean;
  followers_count: number;
  following_count: number;
  posts: IPost[];
}
export interface IFollows {
  follower_id: string; // the user who is doing the following
  following_id: string; // the user being followed
  created_at: string;
}
