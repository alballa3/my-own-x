import { Route } from "../types/route";
import Login from "./auth/login";
import register from "./auth/register";
import { getUser, logout } from "./auth/session";

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
    path: "/auth/logout",
    method: "POST",
    handler: logout
  }];
