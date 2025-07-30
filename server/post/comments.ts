import http from "http"
import zod from "zod"
import { getRequestBody, JsonParse } from "../../lib/http"
import { GetSession, isAuth } from "../auth/session"
import { UserInDB } from "../../types/auth"
import { IComment, IPost } from "../../types/posts"
import { FindBy } from "../../lib/db"
const schama = zod.object({
    comment: zod.string().min(1).max(100),
    post_id: zod.string().min(1).max(100),
})
export default async function createComment(req: http.IncomingMessage, res: http.ServerResponse) {
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
    let comment: IComment = {
        user_id: session.id,
        comment: result.data.comment,
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
    let post = FindBy("posts", "post_id", result.data.post_id, true) as unknown as IPost
    if (!post) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "Post Not Found"
        }))
        return;
    }
    comment.username = session.name
    post.comments.push(comment)
    res.statusCode = 200;
    res.end(JSON.stringify(comment))
}