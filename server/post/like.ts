import http from "http"

import { GetSession, isAuth } from "../auth/session"
import { UserInDB } from "../../types/auth"
import { getRequestBody } from "../../lib/http";
import { decrement, FindAll, FindBy, increment, Store, StoreUnique } from "../../lib/db";
import { like } from "../../types/posts";


export default async function Like(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = await getRequestBody(req)
    let json: any;
    try {
        json = JSON.parse(body as string);
    } catch (error) {
        res.statusCode = 404; res.end(JSON.stringify({
            message: "Failed To Parse JSON",
            error: error
        }))
        return;
    }

    let auth = isAuth(req, true)
    if (!auth) {
        res.statusCode = 401;
        res.end(JSON.stringify({
            error: "You Must To be authorized To Post"
        }))
        return;
    }
    const id = json.id
    if (!id || isNaN(id)) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "Please Enter an Vaild An id."
        }))
        return;
    }
    const session = GetSession(req) as UserInDB
    if (!session) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "You Must To be authorized To Post"
        }))
        return;
    }
    let allLikes = FindAll("likes") as unknown as like
    let check: [string, like] | undefined = Object.entries(allLikes).find(([_, like]) => like.post_id == id && like.user_id == session.id)
    if (check) {
        const [like_id, like_check] = check
        decrement("posts", like_check.like ? "likes" : "dislikes", { id_name: "post_id", id: like_check.post_id })
        delete allLikes[like_id]
        res.end(JSON.stringify({
            message: "Unliked"
        }))
        return;
    }
    const checkPost = FindBy("posts", "post_id", id, true)
    if (!checkPost) {
        res.statusCode = 404;
        res.end(JSON.stringify({
            error: "Post Not Found"
        }))
        return;
    }
    let like: like = {
        user_id: session.id,
        post_id: id,
        like: true,
        created_at: new Date()
    }
    Store("likes", like)
    res.statusCode = 200;
    increment("posts", "likes", { id_name: "post_id", id: id })

    res.end(JSON.stringify({
        message: "Liked"
    }))
}