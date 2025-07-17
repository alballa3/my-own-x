import { Route } from "../types/route";
import register from "./auth/register";

export const route: Route[] = [
  {
    path: "/auth/register",
    method: "POST",
    handler: register,
  },
  {
    path: "/api",
    method: "GET",
    handler: (req, res) => {
      res.end("Hello APIz");
    },
  },
];
