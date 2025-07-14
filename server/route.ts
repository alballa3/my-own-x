import { Route } from "../types/route";

export const route: Route[] = [
  {
    path: "/",
    method: "GET",
    handler: (req, res) => {
      res.end("Hello World");
    },
  },
  {
    path: "/api",
    method: "GET",
    handler: (req, res) => {
      res.end("Hello APIz");
    },
  },
];
