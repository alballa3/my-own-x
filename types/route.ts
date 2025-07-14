import http from "http";
export interface Route {
  path: string;
  method: string;
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
}
