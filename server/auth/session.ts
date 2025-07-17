import { session } from "../../types/auth";

export function sessionHandler() {

}
export function createSession(Remember: boolean): session {
    const rememberTime = Remember ? 7 : 14
    const expiresTime = Date.now() + rememberTime * 24 * 60 * 60 * 1000;
    return {
        session_id: (Date.now() + Math.round(Math.random() * 100)).toString(),
        expiresAt: expiresTime.toString(),
        createdAt: Date.now().toString()
    }
}