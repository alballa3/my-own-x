import http from "http"
import { FindAll, FindBy } from "../../lib/db"
import { IComment, IPost, like } from "../../types/posts"
import { UserInDB } from "../../types/auth";
import { GetSession } from "../auth/session";
import { parse } from "url";

export default function ViewOne(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = parse(req.url!).query?.split("=")[1]
    if (!id) {
        return res.end(JSON.stringify({ error: "No id provided" }))
    }
    const post = FindBy("posts", "post_id", id, true) as unknown as IPost
    if (!post) {
        return res.end(JSON.stringify({ error: "No post found" }))
    }
    const allLikes = Object.values(FindAll("likes") || {}) as unknown as like[]
    const session = GetSession(req) as UserInDB

    let check = Object.values(allLikes || {}).find((like: like) => like.post_id == post.post_id && like.user_id == session?.id)
    const user = FindBy("users", "id", post.user_id, true) as unknown as UserInDB
    let comment=post.comments.map((comment: IComment) => {
        return {
            user_id: comment.user_id,
            username: comment.username,
            comment: comment.comment,
            likes: comment.likes,
            dislikes: comment.dislikes,
            created_at: comment.created_at,
            updated_at: comment.updated_at
        }
    })
    console.log(comment)
    return res.end(JSON.stringify({
        post_id: post.post_id,
        post: post.post,
        likes: post.likes,
        dislikes: post.dislikes,
        comments: post.comments,
        created_at: post.created_at,
        updated_at: post.updated_at,
        user: {
            username: user.name,
            is_liked: check ? true : false
        }
    }))
}