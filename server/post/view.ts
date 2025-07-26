import http from "http"
import { FindAll, FindBy } from "../../lib/db"
import { IPost } from "../../types/posts"
import { UserInDB } from "../../types/auth";

export default function ViewAllPosts(req: http.IncomingMessage, res: http.ServerResponse) {
    const allPostsMap = FindAll("posts") as unknown as Record<string, IPost>;
    const allPostsArray: IPost[] = Object.values(allPostsMap);
    let posts = allPostsArray.map((post: IPost) => {
        const user = FindBy("users", "id", post.user_id,true) as unknown as UserInDB;
        console.log(user)
        if (!user) {
            throw new Error(`User not found for post ${post.post_id}`);
        }
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
            }
        }
    })
    return res.end(JSON.stringify(posts))
}