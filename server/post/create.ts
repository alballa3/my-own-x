import http from "http"
import zod from "zod"
import { getRequestBody, JsonParse } from "../../lib/http"
import { GetSession, isAuth } from "../auth/session"
import { IPost } from "../../types/posts"
import { UserInDB } from "../../types/auth"
import { Store } from "../../lib/db"

const schama = zod.object({
    post: zod.string().min(1).max(100),
})
export default async function createPost(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = await getRequestBody(req)
    let auth = isAuth(req, true)
    if (!auth) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "You Must To be authorized To Post"
        }))
        return;
    }
    let json = JsonParse(body as string)
    if (!json) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "Failed To Parse an JSON"
        }))
        return;
    }
   
    const result = schama.safeParse(json)
    if (!result.success) {
        res.statusCode = 400;
        res.end(JSON.stringify(result.error.flatten().fieldErrors))
        return;
    }
    const session = GetSession(req) as UserInDB
    const Post: IPost = {
        post_id: (Date.now() * Math.round(Math.random() * 100)).toString(),
        user_id: session.id,
        post: result.data.post,
        likes: 0,
        dislikes: 0,
        comments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
            username: session.name
        }
    }
    Store("posts", {
        post_id: (Date.now() * Math.round(Math.random() * 100)).toString(),
        user_id: session.id,
        post: result.data.post,
        likes: 0,
        dislikes: 0,
        comments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    })
    res.statusCode = 200;
    res.end(JSON.stringify(Post))
}