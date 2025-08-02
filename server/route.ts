import { Route } from "../types/route";
import Login from "./auth/login";
import profile from "./auth/profile";
import register from "./auth/register";
import { getUser, logout } from "./auth/session";
import createComment from "./post/comments";
import createPost from "./post/create";
import Dislike from "./post/dislike";
import Like from "./post/like";
import ViewOne from "./post/single";
import ViewAllPosts from "./post/view";
import profilePublic from "./users/profile";

export const route: Route[] = [
  {
    path: "/auth/register",
    method: "POST",
    handler: register,
  },
  {
    path: "/auth/login",
    method: "POST",
    handler: Login,

  },
  {
    path: "/auth/session",
    method: "GET",
    handler: getUser
  },
  {
    path: "/auth/profile",
    method: "GET",
    handler: profile
  },
  {
    path: "/auth/logout",
    method: "POST",
    handler: logout
  },
  {
    path: "/post/create",
    method: "POST",
    handler: createPost
  },
  {
    path: "/post/all",
    method: "GET",
    handler: ViewAllPosts
  },
  {
    path: "/post/like",
    method: "POST",
    handler: Like
  },
  {
    path: "/post/dislike",
    method: "POST",
    handler: Dislike
  },
  {
    path: "/post/view",
    method: "GET",
    handler: ViewOne
  },
  {
    path: "/post/comment",
    method: "POST",
    handler: createComment
  },
  {
    path:"/user/profile",
    method: "GET",
    handler: profilePublic
  }
];
