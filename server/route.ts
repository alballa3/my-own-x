import { Route } from "../types/route";
import Login from "./auth/login";
import register from "./auth/register";

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
];
