import http from "http"
import { FindAll, FindBy } from "../../lib/db"
import { IPost, like } from "../../types/posts"
import { UserInDB } from "../../types/auth";
import { GetSession } from "../auth/session";

export default function ViewAllPosts(req: http.IncomingMessage, res: http.ServerResponse) {
    const url = new URL(req.url as string, `http://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid limit or page" }));
    }

    const allPostsMap = FindAll("posts") as unknown as Record<string, IPost>;
    const allPostsArray: IPost[] = Object.values(allPostsMap || {});
    const total_pages = Math.ceil(allPostsArray.length / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    const pagePosts = allPostsArray.slice(start, end);

    const posts = pagePosts.map((post: IPost) => {
        const user = FindBy("users", "id", post.user_id, true) as unknown as UserInDB;
        if (!user) {
            throw new Error(`User not found for post ${post.post_id}`);
        }

        const allLikes = Object.values(FindAll("likes") || {}) as unknown as like[];
        const session = GetSession(req) as UserInDB;

        const checkLike = allLikes.find(l => l.post_id === post.post_id && l.user_id === session.id && l.like);
        const checkDislike = allLikes.find(l => l.post_id === post.post_id && l.user_id === session.id && !l.like);

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
                is_liked: !!checkLike,
                is_dislike: !!checkDislike
            }
        };
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
        page,
        limit,
        total_pages,
        posts
    }));
}
