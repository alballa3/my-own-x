import http from "http"
import { GetSession, isAuth } from "./session"
import { FindBy } from "../../lib/db";

export default async function profile(req: http.IncomingMessage, res: http.ServerResponse) {
    let auth = isAuth(req, false)
    if (!auth) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "You must to be an authenticated have an profile."
        }))
        return;
    }
    const session = GetSession(req)
    if (!session) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "You must to be an authenticated have an profile."
        }))
        return;
    }
    let profile = {
        name: session.name,
        posts: FindBy("posts", "user_id", session.id, false)
    }
    res.end(JSON.stringify(profile))
}
