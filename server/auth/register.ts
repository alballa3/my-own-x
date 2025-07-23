import http from "http"
import zod from "zod"
import { getRequestBody, JsonParse } from "../../lib/http"
import { StoreUnique } from "../../lib/db"
import { createHash } from "crypto"
import { createSession, isAuth } from "./session"
import { IUser } from "../../types/auth"
const schama = zod.object({
    email: zod.string().email(),
    name: zod.string().min(1, "Please Enter An Vaild Name").max(300, "YOU have reached the max length"),
    password: zod.string().min(6, "The minimum length is 6")
})
export default async function register(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = await getRequestBody(req)
    let auth = isAuth(req, false)
    if (auth) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "YOU CANT REGISTER IF YOUR authorized"
        }))

        return;
    }
    let json = JsonParse(body as string)
    if (!json) {
        res.statusCode = 400;
        res.end(JSON.stringify({
            error: "Failed To Parse an JSON"
        }))
        return;
    }
    const result = schama.safeParse(json)
    if (!result.success) {
        res.statusCode = 400;
        res.end(JSON.stringify(result.error.flatten().fieldErrors))
        return;
    }
    try {
        result.data.password = createHash("sha256").update(result.data.password).digest("hex");
        let session = createSession(false)
        let data: IUser = {
            id: session.session_id,
            name: result.data.name,
            email: result.data.email,
            password: result.data.password,
            session: [
                session
            ]
        }
        let check = StoreUnique("users", "email", data)
        res.setHeader('Set-Cookie', `user=${data.session[0].session_id}; Path=/; HttpOnly Expires=${data.session[0].expiresAt}`);
        res.end(JSON.stringify(check))
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }))
    }
}