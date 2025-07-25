import http from "http"
import { FindAll, FindBy } from "../../lib/db"
import { IPost } from "../../types/posts"
import { UserInDB } from "../../types/auth";

export default async function ViewAllPosts(req: http.IncomingMessage, res: http.ServerResponse) {
    const allPostsMap = FindAll("posts") as unknown as Record<string, IPost>;
    const allPostsArray: IPost[] = Object.values(allPostsMap);
    let posts = allPostsArray.map((post: IPost) => {
        const Users = FindBy("users", "id", post.user_id) as unknown as UserInDB
        return {
            post_id: post.post_id,
            post: post.post,
            likes: post.likes,
            dislikes: post.dislikes,
            comments: post.comments,
            created_at: post.created_at,
            updated_at: post.updated_at,
            user: {
                username: Users.name,
            }
        }
    })

    return res.end(JSON.stringify(posts))
}