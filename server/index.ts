import http from "http";
import { route } from "./route";
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { RecordDB } from "../types/db";
const db_path = "./data.json"

export let db: RecordDB = {};
if (existsSync(db_path)) {
  try {
    const data = readFileSync(db_path)
    const json = JSON.parse(data.toLocaleString())
    db = json
  } catch (error) {
    console.log(error)
    db={}
  }
}

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = new URL(req?.url as string, `http://${req.headers.host}`);
  const handler = route.find((route) => {
    return route.path === url.pathname && route.method === method;
  });
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (handler) {
    handler.handler(req, res);
  } else {
    res.end("404 Not Found");
  }
});
server.listen(4000, () => {
  console.log("Server is running on port localhost:4000");
});
setInterval(() => {
  writeFileSync(db_path, JSON.stringify(db, null, 2));
}, 1000);
