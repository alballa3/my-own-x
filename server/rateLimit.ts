import http from "http"


// The Data Type is 
// [ip, [time, time, time, time, time]]
export const rateLimit = new Map<string, string[]>()
const rateLimitMax = 5000
// the user can make 5 requests per 10 seconds
export function rate(req: http.IncomingMessage) {
    const ip = req.socket.remoteAddress || "unknown"
    const allTime = rateLimit.get(ip) || []
    const check = allTime.filter((t) => Date.now() - parseInt(t) < rateLimitMax)

    if (check.length >= 5) {
        throw new Error("Too many requests")
    }
    //This should be that is alright 
    check?.push(Date.now().toString())
    rateLimit.set(ip, check)

}