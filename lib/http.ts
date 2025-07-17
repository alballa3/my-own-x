import { IncomingMessage } from "http";

export function getRequestBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let data = ""
        req.on("data", (chunk) => {
            data += chunk.toString()
        })
        req.on("error", (error) => {
            reject(error)
            console.log(error)
        })
        req.on("end", () => {
            resolve(data)
        })
    })
}
export function JsonParse(body: string): string | null {
    try {
        const parse = JSON.parse(body)
        return parse
    } catch (error) {
        return null
    }
}