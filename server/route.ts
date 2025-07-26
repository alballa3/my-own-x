import { Route } from "../types/route";
import Login from "./auth/login";
import profile from "./auth/profile";
import register from "./auth/register";
import { getUser, logout } from "./auth/session";
import createPost from "./post/create";
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
  }
];
