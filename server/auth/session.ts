import { IncomingMessage } from "http";
import { session, UserCollection, UserInDB } from "../../types/auth";
import { FindAll } from "../../lib/db";
import { db } from "..";
import { createHash } from "crypto";

export function addSession(Remember: boolean, email: string, session: session) {
    const allUsers = FindAll("users") as unknown as UserCollection
    for (const [id, _] of Object.entries(allUsers)) {
        if (allUsers[id].email == email) {
            let user = db["users"] as unknown as UserCollection
            user[id].session.push(session)
            return;
        }
    }
    throw Error("THE USER IS NOT FOUND")
}
export function VaildThePass(password: string, email: string) {
    const allUsers = FindAll("users") as unknown as UserCollection
    for (const [id, _] of Object.entries(allUsers)) {
        if (allUsers[id].email == email) {
            let user = db["users"] as unknown as UserCollection
            let HashedPass = createHash("sha256").update(password).digest("hex")
            return HashedPass == user[id].password;
        }
    }
    return false
}
export function createSession(Remember: boolean): session {
    const rememberTime = Remember ? 7 : 14
    const expiresTime = Date.now() + rememberTime * 24 * 60 * 60 * 1000;
    return {
        session_id: (Date.now() * Math.round(Math.random() * 100)).toString(),
        expiresAt: expiresTime.toString(),
        createdAt: Date.now().toString()
    }
}
//Check is if Something is important to check if the user is auth and check if it in the db
export function isAuth(req: IncomingMessage, check: boolean) {
    // const cookie = req.headers.cookie;
    const rawCookie = req.headers.cookie;
    if (!rawCookie) {
        return false;
    }
    if (check) {
        const sessionId = rawCookie.split("=")[1];
        console.log(sessionId)
        const usersInDb = FindAll("users");
        const allUsers = Object.values(usersInDb || {}) as unknown as UserInDB[];
        // Find the user who has a session with the matching session ID
        for (const users of allUsers) {
            let check = users.session.some((s) => s.session_id == sessionId)
            if (check) {
                return true;
            }
        }
        return false;
    }
    return true
}