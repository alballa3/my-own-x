
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

    }
}
interface IComment {
    user_id: string,
    comment: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}
