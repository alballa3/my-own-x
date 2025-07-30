
export interface IPost {
    user_id: string,
    post_id: string,
    post: string,
    likes: number,
    dislikes: number,
    comments: IComment[],
    created_at: string,
    updated_at: string,
    user?: {
        username: string,
        is_liked?: boolean
    }
}
export interface IComment {
    user_id: string,
    username?: string,
    comment: string,
    likes: number,
    dislikes: number,
    created_at: string | Date,
    updated_at: string | Date
}
export interface like {
    user_id: string,
    post_id: string,
// The Like True Is Like False Dislike
    like: boolean,
    created_at: string | Date
}
