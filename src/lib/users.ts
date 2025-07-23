interface IUser {
    name: string,
    email: string,
    password: string,
    session: session[],
}
interface session {
    session_id: string,
    expiresAt: Date | string,
    createdAt: Date | string
}
interface UserInDB extends IUser {
    created_at: Date | String
}
export async function getUserFrontEnd(): Promise<UserInDB | null> {
    const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/auth/session`, {
        method: "GET",
        credentials: "include"
    })
    const json = await reponse.json() as UserInDB | null
    return json || null
}