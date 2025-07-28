import http from "http"
import { FindAll, FindBy } from "../../lib/db"
import { IPost, like } from "../../types/posts"
import { UserInDB } from "../../types/auth";
import { GetSession } from "../auth/session";

export default function ViewAllPosts(req: http.IncomingMessage, res: http.ServerResponse) {
    const allPostsMap = FindAll("posts") as unknown as Record<string, IPost>;
    const allPostsArray: IPost[] = Object.values(allPostsMap || {});
    let posts = allPostsArray.map((post: IPost) => {
        const user = FindBy("users", "id", post.user_id, true) as unknown as UserInDB;
        if (!user) {
            throw new Error(`User not found for post ${post.post_id}`);
        }
        const allLikes = Object.values(FindAll("likes") || {}) as unknown as like[]
        const session = GetSession(req) as UserInDB

        // let check = Object.values(allLikes || {}).find((like: like) => like.user_id == session?.id) ? true : false
        let check = Object.values(allLikes || {}).find((like: like) => like.post_id == post.post_id && like.user_id == session.id)

        return {
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
        }
    })
    return res.end(JSON.stringify(posts))
}