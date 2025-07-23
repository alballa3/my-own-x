import http from "http"
import zod from "zod"
import { getRequestBody, JsonParse } from "../../lib/http"
import { addSession, createSession, isAuth, VaildThePass } from "./session"
const schama = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, "The minimum length is 6")
})
export default async function Login(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = await getRequestBody(req)
    let auth = isAuth(req, false)
    if (auth) {
        res.statusCode = 400;

        res.end(JSON.stringify({
            error: "User is already authenticated"
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
        let vaildtionThePass = VaildThePass(result.data.password, result.data.email)
        if (!vaildtionThePass) {
            res.statusCode = 400;
            throw Error("Please Enter an Vaild Password or email")
        }
        let session = createSession(true)
        addSession(true, result.data.email, session);
        res.setHeader('Set-Cookie', `user=${session.session_id}; Path=/; HttpOnly`);
        res.end(JSON.stringify({ message: "Login Is successful" }))

    } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: error.message }))
    }
}