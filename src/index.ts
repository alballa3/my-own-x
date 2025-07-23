export async function getUserFrontEnd() {
    const reponse = await fetch(`${import.meta.env.VITE_BACKEND}/auth/session`, {
        method: "GET",
        credentials: "include"
    })
    const json = await reponse.json()
    return json || false
}


