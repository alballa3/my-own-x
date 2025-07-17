import http from "http"
import zod from "zod"
import { getRequestBody, JsonParse } from "../../lib/http"
import { Find, Store, StoreUnique } from "../../lib/db"
import { createHash } from "crypto"
import { createSession } from "./session"
import { IUser } from "../../types/auth"
const schama = zod.object({
    email: zod.string().email(),
    name: zod.string().min(1, "Please Enter An Vaild Name").max(300, "YOU have reached the max length"),
    password: zod.string().min(6, "The minimum length is 6")
})
export default async function register(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = await getRequestBody(req)

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
            name: result.data.name,
            email: result.data.email,
            password: result.data.password,
            session: [
                session
            ]
        }
        let check = StoreUnique("users", "email", data)
        res.end(JSON.stringify(data))
    } catch (error) {
        res.end(JSON.stringify({ error: error.message }))
    }
}