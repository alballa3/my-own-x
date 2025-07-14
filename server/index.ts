import http from "http";
import { route } from "./route";

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = new URL(req?.url as string, `http://${req.headers.host}`);
  const handler = route.find((route) => {
    return route.path === url.pathname && route.method === method;
  });
  if (handler) {
    handler.handler(req, res);
  } else {
    res.end("404 Not Found");
  }
});
server.listen(4000, () => {
  console.log("Server is running on port localhost:4000");
});
