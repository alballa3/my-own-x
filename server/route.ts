import { Route } from "../types/route";
import Login from "./auth/login";
import profile from "./auth/profile";
import register from "./auth/register";
import { getUser, logout } from "./auth/session";
import createPost from "./post/create";
import Dislike from "./post/dislike";
import Like from "./post/like";
import ViewAllPosts from "./post/view";

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
    path:"/post/dislike",
    method:"POST",
    handler:Dislike
  }
];
