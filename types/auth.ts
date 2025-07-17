export interface IUser {
    name: string,
    email: string,
    password: string,
    session: session[],
}
export interface session {
    session_id: string,
    expiresAt: Date | string,
    createdAt: Date | string
}