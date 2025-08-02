import http from "http";
import { Find, FindAll, FindBy } from "../../lib/db";
import { Profile, UserInDB } from "../../types/auth";
import { IPost, like } from "../../types/posts";
import { GetSession } from "../auth/session";

export default async function profilePublic(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const id = url.searchParams.get("id");
  if (!id || isNaN(Number(id))) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "PLAESE ENTER VAILD ID PLEASE" }));
    return;
  }
  const user = FindBy("users", "id", id, true) as unknown as UserInDB;
  if (!user) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "USER NOT FOUND" }));
    return;
  }
  const pagePosts = FindBy("posts", "user_id", id, false) as unknown as IPost[];
  const session = GetSession(req) as UserInDB;

  const posts = pagePosts.map((post: IPost) => {
    const user = FindBy(
      "users",
      "id",
      post.user_id,
      true
    ) as unknown as UserInDB;
    if (!user) {
      throw new Error(`User not found for post ${post.post_id}`);
    }

    const allLikes = Object.values(FindAll("likes") || {}) as unknown as like[];

    const checkLike = allLikes.find(
      (l) => l.post_id === post.post_id && l.user_id === session.id && l.like
    );
    const checkDislike = allLikes.find(
      (l) => l.post_id === post.post_id && l.user_id === session.id && !l.like
    );

    return {
      user_id: post.user_id,
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
        is_dislike: !!checkDislike,
      },
    };
  });
  let profile: Profile = {
    name: user.name,
    bio: user.bio,
    is_user: session.id === user.id,
    created_at: user.created_at.toString(),
    posts_count: posts.length,
    followers_count: 0,
    following_count: 0,
    posts: posts,
  };
  res.statusCode = 200;
  res.end(JSON.stringify(profile));
}
