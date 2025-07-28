import http from "http"

import { GetSession, isAuth } from "../auth/session"
import { UserInDB } from "../../types/auth"
import { parse } from "url";
import { getRequestBody, JsonParse } from "../../lib/http";
import { FindAll, FindBy, increment, Store, StoreUnique } from "../../lib/db";
import { like } from "../../types/posts";


export default async function Dislike(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = await getRequestBody(req)
    let json: any;
    try {
        json = JSON.parse(body as string);
    } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            message: "Failed To Parse JSON",
            error: error
        }))
        return;
    }

    let auth = isAuth(req, true)
    if (!auth) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "You Must To be authorized To Post"
        }))
        return;
    }
    const session = GetSession(req) as UserInDB
    const id = json.id
    if (!id || isNaN(id)) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "Please Enter an Vaild An id."
        }))
        return;
    }
    let allLikes = FindAll("likes") as unknown as like
    let check = Object.values(allLikes || {}).find((like: like) => like.post_id == id && like.user_id == session.id )
    if (check) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "You Already Disliked This Post"
        }))
        return;
    }
    const checkPost = FindBy("posts", "post_id", id, true)
    if (!checkPost) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "Post Not Found"
        }))
        return;
    }
    let like: like = {
        user_id: session.id,
        post_id: id,
        like: false,
        created_at: new Date()
    }
    Store("dislikes", like)
    res.statusCode = 200;
    increment("posts", "dislikes", { id_name: "post_id", id: id })

    res.end(JSON.stringify({
        message: "disliked"
    }))
}