import { IFollows } from "./../../types/auth";
import http from "http";

import { GetSession, isAuth } from "../auth/session";
import { UserInDB } from "../../types/auth";
import { FindAll, FindBy, Store } from "../../lib/db";

interface Follow_colloction {
  [id: string]: IFollows;
}
export default async function Follow(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let auth = isAuth(req, true);
  if (!auth) {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        error: "You Must To be authorized To Post",
      })
    );
    return;
  }
  let id = new URL(
    req.url as string,
    `http://${req.headers.host}`
  ).searchParams.get("id");
  if (!id || isNaN(Number(id))) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error: "Please Enter an Vaild An id.",
      })
    );
    return;
  }
  const session = GetSession(req) as UserInDB;
  if (!session) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error: "You Must To be authorized To Post",
      })
    );
    return;
  }
  let follows = FindBy(
    "follows",
    "follower_id",
    session.id,
    true
  ) as unknown as IFollows;
  if (follows) {
    let allFollow = FindAll("follows") as unknown as Follow_colloction;
    for (const follow in allFollow) {
      if (
        allFollow[follow].following_id === id ||
        allFollow[follow].follower_id == session.id
      ) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "NOT FOLLOWED" }));
        delete allFollow[follow];
      }
    }
    return;
  }
  let follow: IFollows = {
    created_at: new Date().toString(),
    follower_id: session.id,
    following_id: id,
  };
  Store("follows", follow);

  res.end(JSON.stringify(follow));
}
